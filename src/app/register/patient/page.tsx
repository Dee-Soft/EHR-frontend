'use client';

import RegisterForm from '@/components/forms/RegisterForm';

export default function PatientRegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Patient Registration</h1>
      <RegisterForm role="Patient" />
    </div>
  );
}