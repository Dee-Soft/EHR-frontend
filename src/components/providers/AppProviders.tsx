'use client';

import { AuthProvider } from '@/context/AuthContext';
import { EncryptionProvider } from '@/context/EncryptionProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EncryptionProvider>
        {children}
      </EncryptionProvider>
    </AuthProvider>
  );
}
