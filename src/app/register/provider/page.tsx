'use client';

import RegisterForm from '@/components/forms/RegisterForm';

export default function ProviderRegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Provider Registration</h1>
      <RegisterForm role="Provider" />
    </div>
  );
}