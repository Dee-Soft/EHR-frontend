import { useEncryptionContext } from '@/context/EncryptionProvider';

export const useEncryption = () => {
  const { frontendPublicKey, decryptSensitiveData } = useEncryptionContext();

  return {
    frontendPublicKey,
    decryptSensitiveData,
  };
};