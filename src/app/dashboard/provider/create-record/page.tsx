'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/auth/RequireAuth';
import EncryptedPatientRecordForm from '@/components/forms/EncryptedPatientRecordForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowLeft, Users, AlertCircle } from 'lucide-react';
import { providerService } from '@/lib/services/providerService';
import { getErrorMessage } from '@/types/error';
import { useAuth } from '@/context/AuthContext';

interface AssignedPatient {
  id: string;
  name: string;
  email: string;
}

export default function CreatePatientRecordPage() {
  const router = useRouter();
  const { user: _user } = useAuth();
  const [assignedPatients, setAssignedPatients] = useState<AssignedPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignedPatients();
  }, []);

  const fetchAssignedPatients = async () => {
    try {
      setLoading(true);
      
      // Fetch assigned patients for the provider using provider service
      const patients = await providerService.getAssignedPatients();
      setAssignedPatients(patients.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email
      })));
    } catch (err: unknown) {
      console.error('Failed to fetch assigned patients:', err);
      setError(getErrorMessage(err) || 'Unable to load assigned patients. You can still create records by entering patient ID manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    // Redirect to records page after successful creation
    setTimeout(() => {
      router.push('/dashboard/provider/records');
    }, 2000);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <RequireAuth allowedRoles={['Provider', 'Admin']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-green-600" />
              Create Patient Record
            </h1>
            <p className="text-muted-foreground mt-2">
              Create a new encrypted patient health record. All sensitive data is protected with end-to-end encryption.
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/provider/records')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Records
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EncryptedPatientRecordForm
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              assignedPatients={assignedPatients}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Assigned Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Loading patients...</p>
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : assignedPatients.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No assigned patients found.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contact a manager to get assigned to patients.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assignedPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {patient.id}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Encryption Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Dual-Key Architecture</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                      Frontend encrypts data before sending
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                      Backend never sees plaintext patient data
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                      Separate keys for frontend and backend
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                      HIPAA-compliant encryption
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t">
                  <h4 className="font-medium text-sm mb-2">Encrypted Fields</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Diagnosis', 'Clinical Notes', 'Medications'].map((field) => (
                      <span
                        key={field}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200"
                      >
                        <Shield className="h-3 w-3" />
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
