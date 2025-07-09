'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RegisterUsersPage() {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      {['Admin', 'Manager', 'Employee', 'Provider', 'Patient'].map((role) => (
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
    </div>
  );
}