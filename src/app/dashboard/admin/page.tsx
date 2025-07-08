'use client';

import RequireAuth from '@/components/auth/RequireAuth';

export default function AdminDashboard() {
  return (
    <RequireAuth allowedRoles={['Admin']}>
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Welcome, Admin!</p>
      </div>
    </RequireAuth>
  );
}
