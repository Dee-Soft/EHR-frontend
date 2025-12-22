import axios from 'axios';
import { getEncryptionHeaders } from './crypto/encryptionService';
import { isEncryptionEnabled } from './openbao/utils';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add encryption headers
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
          config.headers['x-encryption-version'] = 'dual-key-v1';
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

// Response interceptor to handle encrypted responses
api.interceptors.response.use(
  async (response) => {
    // Check if response contains encrypted data
    const hasEncryptedData = response.headers['x-encrypted-data'] === 'true';
    
    if (hasEncryptedData && response.data) {
      try {
        // In the dual-key architecture, the backend returns encrypted data
        // with the encrypted AES key. We need to decrypt it.
        // This would be handled by specific service functions, not here.
        // We'll just pass through the data for now.
        response.data._encrypted = true;
      } catch (error) {
        console.error('Failed to process encrypted response:', error);
      }
    }

    return response;
  },
  (error) => {
    // Handle encryption-related errors
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400 && data?.message?.includes('encryption')) {
        console.error('Encryption error:', data.message);
        error.encryptionError = true;
      }
      
      if (status === 503 && data?.message?.includes('OpenBao')) {
        console.error('OpenBao unavailable:', data.message);
        error.openBaoError = true;
      }
    }
    
    return Promise.reject(error);
  }
);

// Export a function to test API connection
export async function testAPIConnection(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

// Export a function to get encryption status
export async function getAPIEncryptionStatus(): Promise<{
  apiConnected: boolean;
  encryptionEnabled: boolean;
  openBaoHealthy: boolean;
}> {
  try {
    const [apiConnected, encryptionEnabled, openBaoHealthy] = await Promise.all([
      testAPIConnection(),
      isEncryptionEnabled(),
      (async () => {
        try {
          const { healthy } = await import('./openbao/utils').then(m => m.checkOpenBaoHealth());
          return healthy;
        } catch {
          return false;
        }
      })(),
    ]);

    return {
      apiConnected,
      encryptionEnabled,
      openBaoHealthy,
    };
  } catch (error) {
    console.error('Failed to get encryption status:', error);
    return {
      apiConnected: false,
      encryptionEnabled: false,
      openBaoHealthy: false,
    };
  }
}

export default api;