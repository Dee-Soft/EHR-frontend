'use client';

import RequireAuth from '@/components/auth/RequireAuth';
import RegisterForm from '@/components/forms/RegisterForm';

export default function AdminRegisterPage() {
  return (
    <RequireAuth allowedRoles={['Admin']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Admin Registration</h1>
        <RegisterForm role="Admin" />
      </div>
    </RequireAuth>
  );
}