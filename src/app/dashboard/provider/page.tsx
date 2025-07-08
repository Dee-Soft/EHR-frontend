'use client';

import RequireAuth from '@/components/auth/RequireAuth';

export default function ProviderDashboard() {
  return (
    <RequireAuth allowedRoles={['Provider']}>
      <div>
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <p>Welcome, Provider!</p>
      </div>
    </RequireAuth>
  );
}
// This page is protected and will only render if the user is authenticated and has the 'Provider' role.
// If the user is not authenticated or does not have the required role, they will be redirected
// to the login page or an unauthorized page.
