'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { User } from '@/types/user';

/**
 * Authentication context type definition.
 * Provides user state and authentication-related functions.
 */
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

/**
 * Default authentication context with empty values.
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

/**
 * Authentication provider component.
 * Manages user authentication state and provides it to child components.
 * Automatically fetches the current user on mount.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetch the currently authenticated user from the backend.
     */
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user || res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 * @returns Authentication context with user state and functions
 */
export const useAuth = () => useContext(AuthContext);
