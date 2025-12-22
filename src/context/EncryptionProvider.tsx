'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getOpenBaoClient } from '@/lib/openbao/client';
import { OPENBAO_KEYS, checkOpenBaoHealth, isEncryptionEnabled } from '@/lib/openbao/utils';

type EncryptionContextType = {
  encryptionAvailable: boolean;
  openBaoHealthy: boolean;
  frontendPublicKey: string | null;
  loading: boolean;
  error: string | null;
  checkHealth: () => Promise<void>;
  encryptData: (data: string) => Promise<string>;
  decryptData: (ciphertext: string) => Promise<string>;
  wrapKey: (plaintext: string) => Promise<string>;
  unwrapKey: (ciphertext: string) => Promise<string>;
};

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export const EncryptionProvider = ({ children }: { children: ReactNode }) => {
  const [encryptionAvailable, setEncryptionAvailable] = useState(false);
  const [openBaoHealthy, setOpenBaoHealthy] = useState(false);
  const [frontendPublicKey, setFrontendPublicKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeEncryption();
  }, []);

  const initializeEncryption = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if encryption is enabled
      const enabled = await isEncryptionEnabled();
      if (!enabled) {
        console.warn('Encryption is disabled or OpenBao is not available');
        setEncryptionAvailable(false);
        setLoading(false);
        return;
      }

      // Check OpenBao health
      const health = await checkOpenBaoHealth();
      setOpenBaoHealthy(health.healthy);

      if (!health.healthy) {
        setError(`OpenBao health check failed. Missing keys: ${health.missingKeys.join(', ')}`);
        setEncryptionAvailable(false);
        setLoading(false);
        return;
      }

      // Get frontend public key
      const client = getOpenBaoClient();
      const publicKey = await client.getPublicKey(OPENBAO_KEYS.FRONTEND_RSA);
      setFrontendPublicKey(publicKey);

      setEncryptionAvailable(true);
    } catch (err: unknown) {
      console.error('Failed to initialize encryption:', err);
      setError(`Encryption initialization failed: ${err instanceof Error ? err.message : String(err)}`);
      setEncryptionAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await checkOpenBaoHealth();
      setOpenBaoHealthy(health.healthy);
      setEncryptionAvailable(health.healthy);
      
      if (!health.healthy) {
        setError(`OpenBao health check failed. Missing keys: ${health.missingKeys.join(', ')}`);
      } else {
        setError(null);
      }
    } catch (err: unknown) {
      console.error('Health check failed:', err);
      setError(`Health check failed: ${err instanceof Error ? err.message : String(err)}`);
      setOpenBaoHealthy(false);
      setEncryptionAvailable(false);
    }
  };

  const encryptData = async (data: string): Promise<string> => {
    if (!encryptionAvailable) {
      throw new Error('Encryption is not available');
    }

    try {
      const client = getOpenBaoClient();
      return await client.encrypt(OPENBAO_KEYS.FRONTEND_AES, data);
    } catch (err: unknown) {
      console.error('Encryption failed:', err);
      throw new Error(`Failed to encrypt data: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const decryptData = async (ciphertext: string): Promise<string> => {
    if (!encryptionAvailable) {
      throw new Error('Encryption is not available');
    }

    try {
      const client = getOpenBaoClient();
      return await client.decrypt(OPENBAO_KEYS.FRONTEND_AES, ciphertext);
    } catch (err: unknown) {
      console.error('Decryption failed:', err);
      throw new Error(`Failed to decrypt data: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const wrapKey = async (plaintext: string): Promise<string> => {
    if (!encryptionAvailable) {
      throw new Error('Encryption is not available');
    }

    try {
      const client = getOpenBaoClient();
      return await client.wrapKey(OPENBAO_KEYS.FRONTEND_RSA, plaintext);
    } catch (err: unknown) {
      console.error('Key wrapping failed:', err);
      throw new Error(`Failed to wrap key: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const unwrapKey = async (ciphertext: string): Promise<string> => {
    if (!encryptionAvailable) {
      throw new Error('Encryption is not available');
    }

    try {
      const client = getOpenBaoClient();
      return await client.unwrapKey(OPENBAO_KEYS.FRONTEND_RSA, ciphertext);
    } catch (err: unknown) {
      console.error('Key unwrapping failed:', err);
      throw new Error(`Failed to unwrap key: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const value: EncryptionContextType = {
    encryptionAvailable,
    openBaoHealthy,
    frontendPublicKey,
    loading,
    error,
    checkHealth,
    encryptData,
    decryptData,
    wrapKey,
    unwrapKey,
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
};

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};