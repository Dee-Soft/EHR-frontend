import axios from 'axios';
import { getEncryptionHeaders } from './crypto/encryptionService';
import { isEncryptionEnabled } from './openbao/utils';

/**
 * Axios instance configured for the EHR backend API.
 * Includes request/response interceptors for encryption handling and authentication.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  withCredentials: true, // Important for JWT cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Request interceptor to automatically add encryption headers for sensitive data.
 * Skips encryption for key exchange endpoints to avoid circular dependencies.
 */
api.interceptors.request.use(
  async (config) => {
    // Skip encryption for key exchange endpoints to avoid circular dependency
    const isKeyExchangeEndpoint = config.url?.includes('/key-exchange/');
    
    if (isKeyExchangeEndpoint) {
      return config;
    }

    // Check if encryption is enabled
    const encryptionEnabled = await isEncryptionEnabled();
    
    if (!encryptionEnabled) {
      return config;
    }

    // Add encryption headers for POST, PUT, PATCH requests with data
    if (config.data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '')) {
      try {
        const encryptionHeaders = await getEncryptionHeaders(config.data);
        
        if (Object.keys(encryptionHeaders).length > 0) {
          config.headers = {
            ...config.headers,
            ...encryptionHeaders,
          };
          
          // Mark that this request has encrypted data
          config.headers['x-encryption-enabled'] = 'true';
        }
      } catch (error) {
        console.error('Failed to add encryption headers:', error);
        // Continue without encryption headers if there's an error
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle encrypted responses and authentication errors.
 * Standardizes response structure and handles common error scenarios.
 */
api.interceptors.response.use(
  async (response) => {
    // Check if response contains encrypted data
    const hasEncryptedData = response.headers['x-encrypted-data'] === 'true';
    
    if (hasEncryptedData && response.data) {
      try {
        // The backend returns encrypted data that needs to be decrypted.
        // This would be handled by specific service functions, not here.
        // We'll just pass through the data for now.
        response.data._encrypted = true;
      } catch (error) {
        console.error('Failed to process encrypted response:', error);
      }
    }

    // Standardize response structure - backend returns { success, message, data }
    if (response.data && typeof response.data === 'object') {
      // If backend returns standardized structure, use it
      if ('success' in response.data && 'data' in response.data) {
        response.data = response.data.data || response.data;
      }
    }

    return response;
  },
  (error) => {
    // Handle authentication and authorization errors
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized - redirect to login
      if (status === 401) {
        console.error('Authentication required. Redirecting to login.');
        // Clear any stored user data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = '/auth/login';
        }
        error.authError = true;
      }
      
      // Handle 403 Forbidden - insufficient permissions
      if (status === 403) {
        console.error('Insufficient permissions:', data?.message || 'Access denied');
        error.permissionError = true;
      }
      
      // Handle encryption-related errors
      if (status === 400 && data?.message?.includes('encryption')) {
        console.error('Encryption error:', data.message);
        error.encryptionError = true;
      }
      
      if (status === 503 && data?.message?.includes('OpenBao')) {
        console.error('OpenBao unavailable:', data.message);
        error.openBaoError = true;
      }
      
      // Extract error message from backend response
      if (data && typeof data === 'object') {
        if (data.message) {
          error.message = data.message;
        } else if (data.error) {
          error.message = data.error;
        }
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error:', error.message);
      error.message = 'Unable to connect to the server. Please check your network connection.';
      error.networkError = true;
    } else {
      // Request setup error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Test the connection to the backend API.
 * @returns Promise resolving to true if connection is successful, false otherwise
 */
export async function testAPIConnection(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

export default api;