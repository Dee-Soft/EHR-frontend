'use client';

import RegisterForm from '@/components/forms/RegisterForm';
import RequireAuth from '@/components/auth/RequireAuth';

export default function EmployeeRegisterPage() {
  return (
    <RequireAuth allowedRoles={['Employee']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Employee Registration</h1>
        <RegisterForm role="Employee" />
      </div>
    </RequireAuth>
  );
}