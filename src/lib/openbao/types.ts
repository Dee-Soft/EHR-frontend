export interface OpenBaoConfig {
  url: string;
  token: string;
  namespace?: string;
}

export interface OpenBaoKeyResponse {
  data: {
    keys?: string[];
    key_info?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

export interface OpenBaoEncryptResponse {
  data: {
    ciphertext: string;
  };
}

export interface OpenBaoDecryptResponse {
  data: {
    plaintext: string;
  };
}

export interface OpenBaoTransitKey {
  name: string;
  type: 'aes256-gcm96' | 'rsa-2048' | 'rsa-4096';
  derived?: boolean;
  exportable?: boolean;
  allow_plaintext_backup?: boolean;
}

export interface OpenBaoKeyWrapRequest {
  plaintext: string;
}

export interface OpenBaoKeyUnwrapRequest {
  ciphertext: string;
}

export interface OpenBaoEncryptRequest {
  plaintext: string;
  context?: string;
  nonce?: string;
}

export interface OpenBaoDecryptRequest {
  ciphertext: string;
  context?: string;
  nonce?: string;
}

export type OpenBaoKeyType = 'aes256-gcm96' | 'rsa-2048' | 'rsa-4096';
