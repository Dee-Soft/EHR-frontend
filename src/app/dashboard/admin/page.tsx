'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Register Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Register new admins, managers, employees, or providers.</p>
          <Link href="/dashboard/admin/register-users">
            <Button className="mt-4">Go to Registration</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>View system-wide audit logs for all actions.</p>
          <Link href="/dashboard/admin/audit-logs">
            <Button className="mt-4">View Audit Logs</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}