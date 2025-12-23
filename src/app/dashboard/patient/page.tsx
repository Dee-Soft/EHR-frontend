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
                View your health records securely. All data is protected and can only be accessed by you and authorized providers.
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
              <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded border">
                <Calendar className="h-4 w-4 inline mr-2" />
                Contact your provider to schedule appointments
              </div>
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
              <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded border">
                <Bell className="h-4 w-4 inline mr-2" />
                Notifications will appear here when available
              </div>
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
              <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded border">
                <Shield className="h-4 w-4 inline mr-2" />
                Your data is protected by default
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Your Data Security</h4>
              <p className="text-sm text-green-700 mt-1">
                Your health records are protected with industry-standard security measures. 
                All sensitive health data is secured and can only be accessed by authorized healthcare providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}