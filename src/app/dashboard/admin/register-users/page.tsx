'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAvailableRegistrationRoles } from '@/lib/rbac/permissions';
import RequireAuth from '@/components/auth/RequireAuth';

export default function RegisterUsersPage() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  const availableRoles = getAvailableRegistrationRoles(user.role);

  return (
    <RequireAuth allowedRoles={['Admin', 'Manager', 'Employee']}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Register New Users</h1>
          <p className="text-muted-foreground">
            Based on your role ({user.role}), you can register the following user types:
          </p>
        </div>
        
        {availableRoles.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                You do not have permission to register any users.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {availableRoles.map((role) => (
              <Card key={role} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{role}</span>
                    <span className="text-xs font-normal px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Allowed
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Register a new {role.toLowerCase()} account with appropriate permissions.
                  </p>
                  <Link href={`/register/${role.toLowerCase()}`}>
                    <Button className="w-full">Register {role}</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Registration Permissions</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Admin: Can register any role (Admin, Manager, Employee, Provider, Patient)</li>
            <li>• Manager: Can register Employee, Provider, Patient</li>
            <li>• Employee: Can register Patient only</li>
            <li>• Provider: Cannot register anyone</li>
            <li>• Patient: Cannot register anyone</li>
          </ul>
        </div>
      </div>
    </RequireAuth>
  );
}