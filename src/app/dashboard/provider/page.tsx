'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, FileText, Users, BarChart } from 'lucide-react';
import RequireAuth from '@/components/auth/RequireAuth';

export default function ProviderDashboard() {
  return (
    <RequireAuth allowedRoles={['Provider', 'Admin']}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-green-600" />
            Provider Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage patient records securely. All sensitive data is protected with industry-standard security measures.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Create Patient Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create new encrypted patient health records. Diagnosis, notes, and medications are encrypted before being sent to the server.
              </p>
              <Link href="/dashboard/provider/create-record">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Record
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                View Patient Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage patient records securely. Decrypt records when needed for patient care.
              </p>
              <Link href="/dashboard/provider/records">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Records
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Assigned Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View patients assigned to you. Manage patient assignments and access their health records.
              </p>
              <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded border">
                <Users className="h-4 w-4 inline mr-2" />
                Available in patient records section
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-orange-600" />
                Statistics & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View statistics and generate reports for your patient records.
              </p>
              <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded border">
                <BarChart className="h-4 w-4 inline mr-2" />
                Coming soon
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}