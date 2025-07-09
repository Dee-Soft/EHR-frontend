'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProviderDashboard() {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Patient Record</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/provider/create-record">
            <Button className="mt-4">Create Record</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Patient Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/provider/records">
            <Button className="mt-4">View Records</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}