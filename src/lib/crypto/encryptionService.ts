import { generateAESKey, encryptWithAES } from './aesUtils';
import { generateRSAKeyPair, encryptAESKeyWithRSAPublicKey } from './rsaUtils';
import { fetchBackendPublicKey, sendFrontendPublicKey } from './keyExchange';

export async function prepareEncryptedPayload(data: Record<string, string | number | boolean>, sensitiveFields: string[]): Promise<{
  encryptedPayload: Record<string, string | number | boolean>;
  encryptedAESKey: string;
  frontendPublicKey: string;
  frontendPrivateKey: string;
}> {
  const { publicKey: frontendPublicKey, privateKey: frontendPrivateKey } = generateRSAKeyPair();
  await sendFrontendPublicKey(frontendPublicKey);

  const backendPublicKey = await fetchBackendPublicKey();
  const aesKey = generateAESKey();

  const encryptedPayload = { ...data };
  for (const field of sensitiveFields) {
    if (data[field]) {
      encryptedPayload[field] = encryptWithAES(data[field], aesKey);
    }
  }

  const encryptedAESKey = encryptAESKeyWithRSAPublicKey(aesKey, backendPublicKey);

  return {
    encryptedPayload,
    encryptedAESKey,
    frontendPublicKey,
    frontendPrivateKey, // Save this securely for decryption later
  };
}
