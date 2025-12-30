'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAvailableRegistrationRoles } from '@/lib/rbac/permissions';

/**
 * Layout component for registration pages that checks RBAC permissions.
 * Prevents unauthorized users from accessing registration forms.
 */
export default function RegisterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { role?: string };
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Check if user has permission to register the requested role
      const availableRoles = getAvailableRegistrationRoles(user.role);
      const requestedRole = params.role?.charAt(0).toUpperCase() + params.role?.slice(1);
      
      if (!availableRoles.includes(requestedRole as 'Admin' | 'Manager' | 'Provider' | 'Employee' | 'Patient')) {
        // Redirect to unauthorized or dashboard
        router.push('/dashboard');
      }
    } else if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    }
  }, [user, loading, router, params.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Registration</h1>
        <p className="text-muted-foreground mt-2">
          Register a new user account. Your permissions are based on your role ({user.role}).
        </p>
      </div>
      {children}
    </div>
  );
}