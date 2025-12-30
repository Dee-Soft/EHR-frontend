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
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * Default authentication context with empty values.
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

/**
 * Authentication provider component.
 * Manages user authentication state and provides it to child components.
 * Automatically fetches the current user on mount.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch the currently authenticated user from the backend.
   */
  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      // Backend returns { success, message, data: { user } }
      const userData = res.data?.user || res.data;
      setUser(userData);
      
      // Store user in localStorage for persistence (excluding sensitive data)
      if (typeof window !== 'undefined' && userData) {
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user by calling backend logout endpoint and clearing local state.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/auth/login';
      }
    }
  };

  /**
   * Refresh user data from backend.
   */
  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      logout,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 * @returns Authentication context with user state and functions
 */
export const useAuth = () => useContext(AuthContext);
