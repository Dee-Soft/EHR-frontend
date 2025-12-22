import api from '../api';

/**
 * Get backend's RSA public key for key wrapping
 * Endpoint: GET /api/key-exchange/public-key
 */
export async function fetchBackendPublicKey(): Promise<string> {
  try {
    const response = await api.get('/key-exchange/public-key');
    return response.data.publicKey;
  } catch (error) {
    console.error('Failed to fetch backend public key:', error);
    throw new Error('Unable to establish secure connection with backend');
  }
}

/**
 * Get frontend's RSA public key from OpenBao (via backend)
 * Endpoint: GET /api/key-exchange/frontend-public-key
 */
export async function fetchFrontendPublicKeyFromBackend(): Promise<string> {
  try {
    const response = await api.get('/key-exchange/frontend-public-key');
    return response.data.publicKey;
  } catch (error) {
    console.error('Failed to fetch frontend public key from backend:', error);
    throw new Error('Unable to retrieve encryption keys');
  }
}

/**
 * Send frontend's RSA public key to backend for key wrapping
 * Note: In the dual-key architecture, frontend public key is sent with each request
 * in the x-client-public-key header, not via a separate endpoint
 */
export async function exchangeKeysWithBackend(): Promise<{
  backendPublicKey: string;
  frontendPublicKey: string;
}> {
  try {
    // Get backend's public key
    const backendPublicKey = await fetchBackendPublicKey();
    
    // In the dual-key architecture, the frontend gets its public key from OpenBao
    // and includes it in request headers. The backend doesn't need a separate endpoint
    // to receive it since it comes with each encrypted request.
    
    return {
      backendPublicKey,
      frontendPublicKey: '', // Will be populated from OpenBao when needed
    };
  } catch (error) {
    console.error('Key exchange failed:', error);
    throw error;
  }
}

/**
 * Check if key exchange is working
 */
export async function testKeyExchange(): Promise<boolean> {
  try {
    const backendKey = await fetchBackendPublicKey();
    return !!backendKey && backendKey.length > 0;
  } catch (error) {
    console.error('Key exchange test failed:', error);
    return false;
  }
}

/**
 * Get encryption status from backend
 */
export async function getEncryptionStatus(): Promise<{
  enabled: boolean;
  backendKeyAvailable: boolean;
  openBaoAvailable: boolean;
}> {
  try {
    // Try to get backend public key as a test
    const backendKey = await fetchBackendPublicKey();
    
    return {
      enabled: true,
      backendKeyAvailable: !!backendKey,
      openBaoAvailable: true, // Assuming OpenBao is available if we got the key
    };
  } catch (_error) {
    return {
      enabled: false,
      backendKeyAvailable: false,
      openBaoAvailable: false,
    };
  }
}