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
    defaultValues: {
      role: role, // Set default role from prop
    },
  });

  /**
   * Handle form submission for user registration.
   * @param data - Form data containing user registration information
   */
  const onSubmit = (data: RegisterSchema) => {
    registerUser(data);
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>{role} Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Full Name</label>
            <Input {...register('name')} placeholder="John Doe" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
          <div>
            <label>Phone (Optional)</label>
            <Input {...register('phone')} placeholder="123-456-7890" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          <div>
            <label>Address (Optional)</label>
            <Input {...register('address')} placeholder="123 Main St, City, State" />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
          <input type="hidden" {...register('role')} />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : `Register ${role}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}