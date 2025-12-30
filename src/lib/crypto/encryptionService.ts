import { prepareEncryptedPayload as openBaoPrepareEncryptedPayload, decryptPatientRecord as openBaoDecryptPatientRecord, isEncryptionEnabled } from '../openbao/utils';

export interface EncryptedPayload {
  encryptedData: Record<string, unknown>;
  encryptedAESKey: string;
  frontendPublicKey: string;
}

export interface PatientRecordData {
  patient: string;
  diagnosis?: string;
  notes?: string;
  medications?: string;
  visitDate: string;
  [key: string]: unknown;
}

/**
 * Prepare encrypted payload for patient record creation
 * Follows the dual-key architecture
 */
export async function prepareEncryptedPatientRecord(
  data: PatientRecordData
): Promise<EncryptedPayload> {
  // Check if encryption is enabled
  const encryptionEnabled = await isEncryptionEnabled();
  
  if (!encryptionEnabled) {
    throw new Error('Encryption is not enabled or OpenBao is not available');
  }

  // Define sensitive fields that need encryption
  const sensitiveFields = ['diagnosis', 'notes', 'medications'];

  // Prepare encrypted payload using OpenBao
  const { encryptedPayload, encryptedAESKey, frontendPublicKey } = 
    await openBaoPrepareEncryptedPayload(data, sensitiveFields);

  return {
    encryptedData: encryptedPayload,
    encryptedAESKey,
    frontendPublicKey,
  };
}

/**
 * Decrypt patient record received from backend
 */
export async function decryptPatientRecord(
  encryptedRecord: unknown,
  encryptedAESKey: string
): Promise<unknown> {
  const encryptionEnabled = await isEncryptionEnabled();
  
  if (!encryptionEnabled) {
    console.warn('Encryption not enabled, returning raw record');
    return encryptedRecord;
  }

  try {
    // Extract encrypted fields
    const encryptedFields: Record<string, string> = {};
    const sensitiveFields = ['diagnosis', 'notes', 'medications'];
    
    // Type guard to check if encryptedRecord is an object
    if (typeof encryptedRecord === 'object' && encryptedRecord !== null) {
      const record = encryptedRecord as Record<string, unknown>;
      
      for (const field of sensitiveFields) {
        const value = record[field];
        if (typeof value === 'string' && value) {
          encryptedFields[field] = value;
        }
      }
    }

    // Decrypt using OpenBao
    const decryptedFields = await openBaoDecryptPatientRecord(
      encryptedFields,
      encryptedAESKey
    );

    // Merge decrypted fields back into record
    return {
      ...encryptedRecord,
      ...decryptedFields,
    };
  } catch (error) {
    console.error('Failed to decrypt patient record:', error);
    throw error;
  }
}

/**
 * Simple encryption for registration data
 */
export async function encryptRegistrationData(data: Record<string, string>): Promise<{
  encryptedData: Record<string, string>;
  encryptedAESKey?: string;
  frontendPublicKey?: string;
}> {
  const encryptionEnabled = await isEncryptionEnabled();
  
  if (!encryptionEnabled) {
    return { encryptedData: data };
  }

  try {
    // For registration, we might not need full dual-key architecture
    // but we'll still encrypt sensitive data
    const sensitiveFields = ['password', 'ssn', 'phone']; // Example sensitive fields
    
    const { encryptedPayload, encryptedAESKey, frontendPublicKey } = 
      await openBaoPrepareEncryptedPayload(data, sensitiveFields);

    return {
      encryptedData: encryptedPayload,
      encryptedAESKey,
      frontendPublicKey,
    };
  } catch (error) {
    console.error('Failed to encrypt registration data:', error);
    // Fallback to plaintext if encryption fails
    return { encryptedData: data };
  }
}

/**
 * Check if a field should be encrypted based on field name
 */
export function isSensitiveField(fieldName: string): boolean {
  const sensitiveFields = [
    'diagnosis',
    'notes', 
    'medications',
    'password',
    'ssn',
    'phone',
    'address',
    'email',
  ];
  
  return sensitiveFields.includes(fieldName.toLowerCase());
}

/**
 * Get encryption headers for API requests
 */
export async function getEncryptionHeaders(data?: unknown): Promise<Record<string, string>> {
  const encryptionEnabled = await isEncryptionEnabled();
  
  if (!encryptionEnabled || !data) {
    return {};
  }

  try {
    // Type guard to check if data is an object
    if (typeof data !== 'object' || data === null) {
      return {};
    }

    const dataObj = data as Record<string, unknown>;
    
    // For patient records, use full dual-key encryption
    if (dataObj.patient && dataObj.visitDate) {
      const encryptedPayload = await prepareEncryptedPatientRecord(dataObj as PatientRecordData);
      
      return {
        'x-encrypted-aes-key': encryptedPayload.encryptedAESKey,
        'x-client-public-key': encryptedPayload.frontendPublicKey,
        'x-encryption-enabled': 'true',
      };
    }

    // For other data, check if it contains sensitive fields
    const hasSensitiveData = Object.keys(dataObj).some(field => isSensitiveField(field));
    
    if (hasSensitiveData) {
      const sensitiveFields = Object.keys(dataObj).filter(field => isSensitiveField(field));
      const { encryptedPayload: _encryptedPayload, encryptedAESKey, frontendPublicKey } = 
        await openBaoPrepareEncryptedPayload(dataObj, sensitiveFields);
      
      return {
        'x-encrypted-aes-key': encryptedAESKey,
        'x-client-public-key': frontendPublicKey,
        'x-encryption-enabled': 'true',
      };
    }

    return {};
  } catch (error) {
    console.error('Failed to prepare encryption headers:', error);
    return {};
  }
}