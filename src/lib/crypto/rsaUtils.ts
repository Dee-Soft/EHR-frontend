import crypto from 'crypto';

export function generateRSAKeyPair(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  });
  return { publicKey, privateKey };
}

export function encryptAESKeyWithRSAPublicKey(aesKey: string, rsaPublicKey: string): string {
  const encryptedKey = crypto.publicEncrypt(
    {
      key: rsaPublicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(aesKey, 'hex')
  );
  return encryptedKey.toString('base64');
}

export function decryptAESKeyWithRSAPrivateKey(encryptedKey: string, rsaPrivateKey: string): string {
  const decryptedKey = crypto.privateDecrypt(
    {
      key: rsaPrivateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encryptedKey, 'base64')
  );
  return decryptedKey.toString('hex');
}