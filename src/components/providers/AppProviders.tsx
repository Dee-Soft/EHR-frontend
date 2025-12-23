'use client';

import { AuthProvider } from '@/context/AuthContext';

/**
 * Root provider component that wraps the application with necessary context providers.
 * Currently provides authentication context to all child components.
 */
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
