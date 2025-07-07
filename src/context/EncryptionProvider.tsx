'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateRSAKeyPair, decryptAESKeyWithRSAPrivateKey } from '@/lib/crypto/rsaUtils';
import { decryptWithAES } from '@/lib/crypto/aesUtils';

type EncryptionContextType = {
  frontendPublicKey: string | null;
  frontendPrivateKey: string | null;
  decryptSensitiveData: (encryptedData: string, encryptedAESKey: string) => string | null;
};

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export const EncryptionProvider = ({ children }: { children: ReactNode }) => {
  const [frontendPublicKey, setFrontendPublicKey] = useState<string | null>(null);
  const [frontendPrivateKey, setFrontendPrivateKey] = useState<string | null>(null);

  useEffect(() => {
    // Generate RSA keys once per session
    const { publicKey, privateKey } = generateRSAKeyPair();
    setFrontendPublicKey(publicKey);
    setFrontendPrivateKey(privateKey);
  }, []);

  const decryptSensitiveData = (encryptedData: string, encryptedAESKey: string): string | null => {
    if (!frontendPrivateKey) return null;

    try {
      const aesKey = decryptAESKeyWithRSAPrivateKey(encryptedAESKey, frontendPrivateKey);
      return decryptWithAES(encryptedData, aesKey);
    } catch (err) {
      console.error('Decryption failed:', err);
      return null;
    }
  };

  return (
    <EncryptionContext.Provider value={{ frontendPublicKey, frontendPrivateKey, decryptSensitiveData }}>
      {children}
    </EncryptionContext.Provider>
  );
};

export const useEncryptionContext = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryptionContext must be used within an EncryptionProvider');
  }
  return context;
};