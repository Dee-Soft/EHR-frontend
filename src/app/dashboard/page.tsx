'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Dashboard index page that redirects users to their role-specific dashboard.
 */
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to role-specific dashboard
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      } else {
        // Redirect to login if not authenticated
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
