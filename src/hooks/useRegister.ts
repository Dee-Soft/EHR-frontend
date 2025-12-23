import { useState } from 'react';
import api from '@/lib/api';
import { RegisterPayload } from '@/types/auth';
import { getErrorMessage } from '@/types/error';

/**
 * Custom hook for user registration functionality.
 * Handles API calls to register new users with the backend.
 */
export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Register a new user with the provided payload.
   * @param payload - User registration data including name, email, password, and role
   */
  const registerUser = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      // Backend expects /users/register endpoint for user registration
      await api.post('/users/register', payload);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
}