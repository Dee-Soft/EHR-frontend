import { getOpenBaoClient } from './client';

// Key names from the dual-key architecture
export const OPENBAO_KEYS = {
  FRONTEND_AES: 'ehr-aes-master-frontend',
  BACKEND_AES: 'ehr-aes-master-backend',
  FRONTEND_RSA: 'ehr-rsa-exchange-frontend',
  BACKEND_RSA: 'ehr-rsa-exchange-backend',
} as const;

export type OpenBaoKeyName = typeof OPENBAO_KEYS[keyof typeof OPENBAO_KEYS];

/**
 * Check if OpenBao is available and keys are configured
 */
export async function checkOpenBaoHealth(): Promise<{
  healthy: boolean;
  keysAvailable: string[];
  missingKeys: string[];
}> {
  const client = getOpenBaoClient();
  
  try {
    const availableKeys = await client.listKeys();
    
    const requiredKeys = Object.values(OPENBAO_KEYS);
    const missingKeys = requiredKeys.filter(key => !availableKeys.includes(key));
    
    return {
      healthy: missingKeys.length === 0,
      keysAvailable: availableKeys,
      missingKeys,
    };
  } catch (error) {
    console.error('OpenBao health check failed:', error);
    return {
      healthy: false,
      keysAvailable: [],
      missingKeys: Object.values(OPENBAO_KEYS),
    };
  }
}

/**
 * Prepare data for encryption according to dual-key architecture
 */
export async function prepareEncryptedPayload(
  data: Record<string, unknown>,
  sensitiveFields: string[]
): Promise<{
  encryptedPayload: Record<string, unknown>;
  encryptedAESKey: string;
  frontendPublicKey: string;
}> {
  const client = getOpenBaoClient();

  try {
    // 1. Get frontend AES key and encrypt sensitive data
    const encryptedPayload = { ...data };
    
    for (const field of sensitiveFields) {
      if (data[field] && typeof data[field] === 'string') {
        encryptedPayload[field] = await client.encrypt(
          OPENBAO_KEYS.FRONTEND_AES,
          data[field]
        );
      }
    }

    // 2. Generate a data key (this will be our frontend AES key for this session)
    const dataKeyResult = await client.generateDataKey(OPENBAO_KEYS.FRONTEND_AES, false);
    if (!dataKeyResult.ciphertext) {
      throw new Error('Failed to generate data key');
    }

    // 3. Get backend RSA public key from OpenBao
    const _backendPublicKey = await client.getPublicKey(OPENBAO_KEYS.BACKEND_RSA);

    // 4. Wrap the data key with backend's RSA public key
    const encryptedAESKey = await client.wrapKey(
      OPENBAO_KEYS.BACKEND_RSA,
      dataKeyResult.ciphertext
    );

    // 5. Get frontend RSA public key
    const frontendPublicKey = await client.getPublicKey(OPENBAO_KEYS.FRONTEND_RSA);

    return {
      encryptedPayload,
      encryptedAESKey,
      frontendPublicKey,
    };
  } catch (error) {
    console.error('Failed to prepare encrypted payload:', error);
    throw error;
  }
}

/**
 * Decrypt patient record data received from backend
 */
export async function decryptPatientRecord(
  encryptedData: Record<string, string>,
  encryptedAESKey: string
): Promise<Record<string, string>> {
  const client = getOpenBaoClient();

  try {
    // 1. Unwrap the backend AES key using frontend RSA private key
    const _unwrappedKey = await client.unwrapKey(
      OPENBAO_KEYS.FRONTEND_RSA,
      encryptedAESKey
    );

    // 2. Decrypt each encrypted field with the unwrapped key
    const decryptedData: Record<string, string> = {};
    
    for (const [field, ciphertext] of Object.entries(encryptedData)) {
      if (ciphertext && ciphertext.startsWith('vault:v1:')) {
        // This is OpenBao encrypted data
        decryptedData[field] = await client.decrypt(
          OPENBAO_KEYS.BACKEND_AES,
          ciphertext
        );
      } else {
        // This is plaintext data
        decryptedData[field] = ciphertext;
      }
    }

    return decryptedData;
  } catch (error) {
    console.error('Failed to decrypt patient record:', error);
    throw error;
  }
}

/**
 * Simple encryption for non-sensitive data (fallback)
 */
export async function simpleEncrypt(
  keyName: OpenBaoKeyName,
  data: string
): Promise<string> {
  const client = getOpenBaoClient();
  return client.encrypt(keyName, data);
}

/**
 * Simple decryption for non-sensitive data (fallback)
 */
export async function simpleDecrypt(
  keyName: OpenBaoKeyName,
  ciphertext: string
): Promise<string> {
  const client = getOpenBaoClient();
  return client.decrypt(keyName, ciphertext);
}

/**
 * Check if encryption is enabled and working
 */
export async function isEncryptionEnabled(): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_ENCRYPTION_ENABLED !== 'true') {
    return false;
  }

  try {
    const health = await checkOpenBaoHealth();
    return health.healthy;
  } catch (error) {
    console.error('Encryption check failed:', error);
    return false;
  }
}
