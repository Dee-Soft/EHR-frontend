'use client';

import RequireAuth from '@/components/auth/RequireAuth';

export default function EmployeeDashboard() {
  return (
    <RequireAuth allowedRoles={['Employee']}>
      <div>
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <p>Welcome, Employee!</p>
      </div>
    </RequireAuth>
  );
}
// This page is protected and will only render if the user is authenticated and has the 'Employee' role.
// If the user is not authenticated or does not have the required role, they will be redirected
// to the login page or an unauthorized page.
