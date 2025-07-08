'use client';

import RequireAuth from '@/components/auth/RequireAuth';

export default function PatientDashboard() {
  return (
    <RequireAuth allowedRoles={['Patient']}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <p>Welcome, Patient! You can view your medical records.</p>
      </div>
    </RequireAuth>
  );
}
// This page is protected and will only render if the user is authenticated and has the 'Patient' role.
// If the user is not authenticated or does not have the required role, they will be redirected
// to the login page or an unauthorized page.