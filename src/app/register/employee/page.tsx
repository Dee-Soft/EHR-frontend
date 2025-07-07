'use client';

import RegisterForm from '@/components/forms/RegisterForm';

export default function EmployeeRegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employee Registration</h1>
      <RegisterForm role="Employee" />
    </div>
  );
}