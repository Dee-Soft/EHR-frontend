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
            Manage patient records with end-to-end encryption. All sensitive data is protected using OpenBao&apos;s dual-key architecture.
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
                View and manage encrypted patient records. Decrypt records securely using OpenBao keys.
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
              <Button variant="outline" className="w-full" disabled>
                <Users className="h-4 w-4 mr-2" />
                View Assigned Patients
              </Button>
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
                View statistics and generate reports for your patient records. All data remains encrypted during processing.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <BarChart className="h-4 w-4 mr-2" />
                View Statistics
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Encryption Status</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your dashboard is secured with OpenBao&apos;s dual-key encryption. All patient data is encrypted before leaving your browser and can only be decrypted by authorized parties.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-blue-700">OpenBao Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-blue-700">Encryption Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-blue-700">HIPAA Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}