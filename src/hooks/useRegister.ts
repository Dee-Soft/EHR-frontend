import { useState } from 'react';
import api from '@/lib/api';
import { RegisterPayload } from '@/types/auth';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', payload);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
}