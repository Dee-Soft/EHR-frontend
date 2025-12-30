'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import RequireAuth from '@/components/auth/RequireAuth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Get the current path
      const path = window.location.pathname;
      
      // Check if user is trying to access a role-specific dashboard they don't have access to
      if (path.startsWith('/dashboard/')) {
        const pathParts = path.split('/');
        const requestedRole = pathParts[2]; // /dashboard/{role}/...
        
        if (requestedRole && requestedRole !== user.role.toLowerCase()) {
          // Redirect to their own dashboard
          router.push(`/dashboard/${user.role.toLowerCase()}`);
        }
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth allowedRoles={['Admin', 'Manager', 'Employee', 'Provider', 'Patient']}>
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
