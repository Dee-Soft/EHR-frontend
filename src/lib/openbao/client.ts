import { OpenBaoConfig, OpenBaoKeyResponse, OpenBaoEncryptResponse, OpenBaoDecryptResponse, OpenBaoKeyWrapRequest, OpenBaoKeyUnwrapRequest, OpenBaoEncryptRequest, OpenBaoDecryptRequest } from './types';

export class OpenBaoClient {
  private config: OpenBaoConfig;
  private baseUrl: string;

  constructor(config: OpenBaoConfig) {
    this.config = config;
    this.baseUrl = `${config.url}/v1`;
  }

  private async request<T>(
    method: string,
    path: string,
    data?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    
    const headers: Record<string, string> = {
      'X-Vault-Token': this.config.token,
      'Content-Type': 'application/json',
    };

    if (this.config.namespace) {
      headers['X-Vault-Namespace'] = this.config.namespace;
    }

    const options: RequestInit = {
      method,
      headers,
      credentials: 'omit',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenBao request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenBao request error:', error);
      throw error;
    }
  }

  // Key management
  async listKeys(): Promise<string[]> {
    try {
      const response = await this.request<OpenBaoKeyResponse>('GET', '/transit/keys');
      return response.data.keys || [];
    } catch (error) {
      console.error('Failed to list keys:', error);
      return [];
    }
  }

  async getKeyInfo(keyName: string): Promise<OpenBaoKeyResponse> {
    try {
      const response = await this.request<OpenBaoKeyResponse>('GET', `/transit/keys/${keyName}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get key info for ${keyName}:`, error);
      throw error;
    }
  }

  // Encryption/Decryption operations
  async encrypt(keyName: string, plaintext: string): Promise<string> {
    try {
      const request: OpenBaoEncryptRequest = { plaintext: btoa(plaintext) };
      const response = await this.request<OpenBaoEncryptResponse>(
        'POST',
        `/transit/encrypt/${keyName}`,
        request
      );
      return response.data.ciphertext;
    } catch (error) {
      console.error(`Failed to encrypt with key ${keyName}:`, error);
      throw error;
    }
  }

  async decrypt(keyName: string, ciphertext: string): Promise<string> {
    try {
      const request: OpenBaoDecryptRequest = { ciphertext };
      const response = await this.request<OpenBaoDecryptResponse>(
        'POST',
        `/transit/decrypt/${keyName}`,
        request
      );
      return atob(response.data.plaintext);
    } catch (error) {
      console.error(`Failed to decrypt with key ${keyName}:`, error);
      throw error;
    }
  }

  // Key wrapping (for RSA key exchange)
  async wrapKey(keyName: string, plaintext: string): Promise<string> {
    try {
      const request: OpenBaoKeyWrapRequest = { plaintext: btoa(plaintext) };
      const response = await this.request<OpenBaoEncryptResponse>(
        'POST',
        `/transit/wrap/${keyName}`,
        request
      );
      return response.data.ciphertext;
    } catch (error) {
      console.error(`Failed to wrap key with ${keyName}:`, error);
      throw error;
    }
  }

  async unwrapKey(keyName: string, ciphertext: string): Promise<string> {
    try {
      const request: OpenBaoKeyUnwrapRequest = { ciphertext };
      const response = await this.request<OpenBaoDecryptResponse>(
        'POST',
        `/transit/unwrap/${keyName}`,
        request
      );
      return atob(response.data.plaintext);
    } catch (error) {
      console.error(`Failed to unwrap key with ${keyName}:`, error);
      throw error;
    }
  }

  // Generate data key
  async generateDataKey(keyName: string, plaintext = false): Promise<{ ciphertext?: string; plaintext?: string }> {
    try {
      const response = await this.request<{ data: { ciphertext?: string; plaintext?: string } }>(
        'POST',
        `/transit/datakey/${plaintext ? 'plaintext' : 'wrapped'}/${keyName}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to generate data key with ${keyName}:`, error);
      throw error;
    }
  }

  // Get public key for RSA keys
  async getPublicKey(keyName: string): Promise<string> {
    try {
      const response = await this.request<{ data: { keys: Record<string, string> } }>(
        'GET',
        `/transit/keys/${keyName}`
      );
      const keys = response.data.keys;
      const latestVersion = Object.keys(keys).sort().pop();
      return keys[latestVersion!];
    } catch (error) {
      console.error(`Failed to get public key for ${keyName}:`, error);
      throw error;
    }
  }
}

// Singleton instance
let openBaoClient: OpenBaoClient | null = null;

export function getOpenBaoClient(): OpenBaoClient {
  if (!openBaoClient) {
    const url = process.env.NEXT_PUBLIC_OPENBAO_URL || 'http://localhost:18200';
    const token = process.env.NEXT_PUBLIC_OPENBAO_TOKEN || 'ehr-permanent-token';
    
    if (!url || !token) {
      throw new Error('OpenBao configuration missing. Please set NEXT_PUBLIC_OPENBAO_URL and NEXT_PUBLIC_OPENBAO_TOKEN');
    }

    openBaoClient = new OpenBaoClient({
      url,
      token,
    });
  }

  return openBaoClient;
}
