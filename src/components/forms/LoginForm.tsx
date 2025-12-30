'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '@/schemas/authSchemas';
import api from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/types/error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginFormProps {
  role: 'Admin' | 'Provider' | 'Patient' | 'Manager' | 'Employee';
}

/**
 * Login form component for authenticating users.
 * Handles form submission, API calls, and redirects based on user role.
 */
export default function LoginForm({ role }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { refreshUser } = useAuth();
  const router = useRouter();

  /**
   * Handle form submission for user login.
   * @param data - Form data containing email and password
   */
  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setError('');

    try {
      // Login and get JWT set in HttpOnly cookie
      // Backend expects: { email, password }
      const response = await api.post('/auth/login', { 
        email: data.email, 
        password: data.password 
      });

      // Backend returns: { success, message, data: { user } }
      if (response.data?.success) {
        // Refresh user data from backend
        await refreshUser();
        
        // Get updated user from context (will be set by refreshUser)
        // Redirect based on user role - we'll handle this in useEffect
        // For now, redirect to generic dashboard, the dashboard will redirect based on role
        router.push('/dashboard');
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      // Provide more user-friendly error messages
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setError('Invalid email or password. Please try again.');
      } else if (errorMessage.includes('Network Error') || errorMessage.includes('timeout')) {
        setError('Unable to connect to the server. Please check your network connection.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Email</label>
        <Input {...register('email')} type="email" placeholder="user@example.com" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label>Password</label>
        <Input {...register('password')} type="password" placeholder="********" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : `Login as ${role}`}
      </Button>
    </form>
  );
}
