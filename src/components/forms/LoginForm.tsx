'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '@/schemas/authSchemas';
import api from '@/lib/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginFormProps {
  role: 'Admin' | 'Provider' | 'Patient' | 'Manager' | 'Employee';
}

export default function LoginForm({ role }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { ...data, role });
      console.log(`${role} login success:`, response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
