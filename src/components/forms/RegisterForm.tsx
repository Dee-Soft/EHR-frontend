'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchema } from '@/schemas/authSchemas';
import { useRegister } from '@/hooks/useRegister';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RegisterFormProps {
  role: 'Admin' | 'Provider' | 'Patient' | 'Manager' | 'Employee';
}

/**
 * Registration form component for creating new user accounts.
 * Handles form validation and submission for different user roles.
 */
export default function RegisterForm({ role }: RegisterFormProps) {
  const { registerUser, loading, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  /**
   * Handle form submission for user registration.
   * @param data - Form data containing user registration information
   */
  const onSubmit = (data: RegisterSchema) => {
    registerUser({ ...data, role });
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>{role} Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>First Name</label>
            <Input {...register('firstName')} placeholder="John" />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          <div>
            <label>Last Name</label>
            <Input {...register('lastName')} placeholder="Doe" />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
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
            {loading ? 'Registering...' : `Register ${role}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}