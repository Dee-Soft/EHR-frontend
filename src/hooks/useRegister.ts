'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const registerUser = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/register', data);
      console.log('Registration successful:', response.data);
      router.push('/login');
    } catch (err: any) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
}