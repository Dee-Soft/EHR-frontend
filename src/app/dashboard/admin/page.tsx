'use client';

import RequireAuth from '@/components/auth/RequireAuth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <RequireAuth allowedRoles={['Admin']}>
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Welcome, Admin!</p>
      </div>
    
      {/* Uncomment the following section if you want to display admin features
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Admin Features</h2>
        <ul className="list-disc pl-5">
          <li>Manage Users</li>
          <li>View Reports</li>
          <li>Configure Settings</li>
        </ul>
      </div>
      */}
      
      <Button onClick={() => router.push('/register/provider')}>
        Register Provider
      </Button>
      <Button onClick={() => router.push('/register/manager')}>
        Register Manager
      </Button>
      <Button onClick={() => router.push('/register/employee')}>
        Register Employee
      </Button>
      <Button onClick={() => router.push('/register/patient')}>
        Register Patient
      </Button>

    </RequireAuth>
  );
}
