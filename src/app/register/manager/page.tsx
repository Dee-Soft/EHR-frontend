'use client';

import RegisterForm from '@/components/forms/RegisterForm';

export default function ManagerRegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manager Registration</h1>
      <RegisterForm role="Manager" />
    </div>
  );
}