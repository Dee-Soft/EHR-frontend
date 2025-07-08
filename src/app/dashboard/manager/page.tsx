'use client';

import RequireAuth from '@/components/auth/RequireAuth';

export default function ManagerDashboard() {
  return (
    <RequireAuth allowedRoles={['Manager']}>
      <div>
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <p>Welcome, Manager!</p>
      </div>
    </RequireAuth>
  );
}
// This page is protected and will only render if the user is authenticated and has the 'Manager' role.
// If the user is not authenticated or does not have the required role, they will be redirected
// to the login page or an unauthorized page.