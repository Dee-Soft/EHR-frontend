'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, FileText, Calendar, Bell, User } from 'lucide-react';
import RequireAuth from '@/components/auth/RequireAuth';
import { useAuth } from '@/context/AuthContext';

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <RequireAuth allowedRoles={['Patient']}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            Patient Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome, {user?.email}! Access your encrypted health records securely.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                My Health Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View your encrypted health records. All data is protected with end-to-end encryption and can only be accessed by you and authorized providers.
              </p>
              <Link href="/dashboard/patient/records">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View My Records
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage your upcoming appointments. Schedule new appointments with healthcare providers.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <Calendar className="h-4 w-4 mr-2" />
                View Appointments
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View important notifications about your health records, appointments, and medication reminders.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <Bell className="h-4 w-4 mr-2" />
                View Notifications
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your privacy settings and control who can access your health records.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <Shield className="h-4 w-4 mr-2" />
                Manage Privacy
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Your Data Security</h4>
              <p className="text-sm text-green-700 mt-1">
                Your health records are protected with military-grade encryption using OpenBao&apos;s dual-key architecture. 
                This means your sensitive health data is encrypted before it leaves your device and can only be 
                decrypted by authorized healthcare providers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded border border-green-100">
                  <h5 className="font-medium text-green-800 text-sm">End-to-End Encryption</h5>
                  <p className="text-xs text-green-700 mt-1">
                    Data encrypted on your device, decrypted only by authorized parties
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-100">
                  <h5 className="font-medium text-green-800 text-sm">Dual-Key Architecture</h5>
                  <p className="text-xs text-green-700 mt-1">
                    Separate keys for frontend and backend ensure maximum security
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-100">
                  <h5 className="font-medium text-green-800 text-sm">HIPAA Compliant</h5>
                  <p className="text-xs text-green-700 mt-1">
                    Meets healthcare data protection standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}