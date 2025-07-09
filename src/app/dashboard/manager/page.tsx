'use client';

import { getAllowedRegistrations } from '@/utils/roleUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ManagerDashboard() {
  const { user } = useAuth();

  const allowedRegistrations = getAllowedRegistrations(user?.role || '');

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      {allowedRegistrations.map((role) => (
        <Card key={role}>
          <CardHeader>
            <CardTitle>{`Register ${role}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/register/${role.toLowerCase()}`}>
              <Button className="mt-4">Register {role}</Button>
            </Link>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Assign Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/manager/assign-patient">
            <Button className="mt-4">Assign Patient</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}