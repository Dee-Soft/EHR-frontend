'use client';

import RegisterForm from '@/components/forms/RegisterForm';
import RequireAuth from '@/components/auth/RequireAuth';

export default function ManagerRegisterPage() {
  return (
    <RequireAuth allowedRoles={['Manager']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Manager Registration</h1>
        <RegisterForm role="Manager" />
      </div>
    </RequireAuth>
  );
}