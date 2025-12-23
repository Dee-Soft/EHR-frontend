import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Home page component displaying role-based login options.
 * Provides entry points for different user roles in the EHR system.
 */
export default function HomePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Access admin dashboard and manage users.</p>
          <Link href="/auth/login/admin" className="text-blue-600 hover:underline">
            Admin Login
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Receptionist</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage employees and patients.</p>
          <Link href="/auth/login/manager" className="text-blue-600 hover:underline">
            Manager Login
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage patients.</p>
          <Link href="/auth/login/employee" className="text-blue-600 hover:underline">
            Employee Login
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Access provider dashboard and patient records.</p>
          <Link href="/auth/login/provider" className="text-blue-600 hover:underline">
            Provider Login
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <p>View your personal health records securely.</p>
          <Link href="/auth/login/patient" className="text-blue-600 hover:underline">
            Patient Login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
