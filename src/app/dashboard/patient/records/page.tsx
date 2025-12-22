'use client';

import { useState, useEffect } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Calendar, 
  User, 
  FileText,
  Stethoscope,
  Pill,
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react';
import api from '@/lib/api';
import { decryptPatientRecord } from '@/lib/crypto/encryptionService';
import { useAuth } from '@/context/AuthContext';

interface PatientRecord {
  _id: string;
  diagnosis: string;
  notes: string;
  medications: string;
  visitDate: string;
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
    role: string;
  };
  encryptedAesKey: string;
  encryptionMetadata: {
    algorithm: string;
    keyId: string;
    encryptedAt: string;
  };
}

export default function PatientRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState<Record<string, unknown>>({});
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  useEffect(() => {
    fetchPatientRecords();
  }, []);

  const fetchPatientRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch patient's own records
      const response = await api.get('/patient-records/my-records');
      setRecords(response.data || []);
    } catch (err: unknown) {
      console.error('Failed to fetch patient records:', err);
      setError('Unable to load your health records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecryptRecord = async (recordId: string, encryptedAesKey: string) => {
    try {
      setDecrypting(recordId);
      setSelectedRecord(recordId);
      
      const record = records.find(r => r._id === recordId);
      if (!record) return;

      // Decrypt the record
      const decryptedRecord = await decryptPatientRecord(
        {
          diagnosis: record.diagnosis,
          notes: record.notes,
          medications: record.medications,
        },
        encryptedAesKey
      );

      setDecryptedData(prev => ({
        ...prev,
        [recordId]: decryptedRecord,
      }));
    } catch (err) {
      console.error('Failed to decrypt record:', err);
      setError('Failed to decrypt record. Encryption service may be unavailable.');
    } finally {
      setDecrypting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProviderBadge = (role: string) => {
    switch (role) {
      case 'Provider':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Stethoscope className="h-3 w-3 mr-1" />
            Healthcare Provider
          </Badge>
        );
      case 'Doctor':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Stethoscope className="h-3 w-3 mr-1" />
            Doctor
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <User className="h-3 w-3 mr-1" />
            {role}
          </Badge>
        );
    }
  };

  const handleExportRecord = (recordId: string) => {
    const record = records.find(r => r._id === recordId);
    const decrypted = decryptedData[recordId];
    
    if (!record || !decrypted) return;

    const exportData = {
      patient: user?.email || 'Unknown',
      visitDate: formatDate(record.visitDate),
      createdBy: record.createdBy.name,
      createdByRole: record.createdBy.role,
      diagnosis: decrypted.diagnosis,
      notes: decrypted.notes,
      medications: decrypted.medications,
      recordDate: formatDate(record.createdAt),
      encryption: {
        algorithm: record.encryptionMetadata?.algorithm,
        keyId: record.encryptionMetadata?.keyId,
        encryptedAt: record.encryptionMetadata?.encryptedAt,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-record-${record.visitDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <RequireAuth allowedRoles={['Patient']}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-green-600" />
            My Health Records
          </h1>
          <p className="text-muted-foreground mt-2">
            View your encrypted health records. Your data is protected with end-to-end encryption.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Loading your health records...</p>
          </div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No health records found</h3>
              <p className="text-muted-foreground mt-2">
                You don&apos;t have any health records yet. Records will appear here after your healthcare provider creates them.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {records.map((record) => {
              const isDecrypting = decrypting === record._id;
              const hasDecryptedData = !!decryptedData[record._id];
              const isSelected = selectedRecord === record._id;
              const decrypted = decryptedData[record._id];

              return (
                <Card key={record._id} className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          Visit on {formatDate(record.visitDate)}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Created by {record.createdBy.name}
                          </span>
                          {getProviderBadge(record.createdBy.role)}
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Encrypted
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {hasDecryptedData ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-blue-600" />
                            Diagnosis
                          </h4>
                          <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
                            {decrypted.diagnosis || 'No diagnosis recorded'}
                          </p>
                        </div>
                        
                        {decrypted.notes && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-600" />
                              Clinical Notes
                            </h4>
                            <p className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                              {decrypted.notes}
                            </p>
                          </div>
                        )}
                        
                        {decrypted.medications && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <Pill className="h-4 w-4 text-green-600" />
                              Medications
                            </h4>
                            <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-100 whitespace-pre-wrap">
                              {decrypted.medications}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                        <div className="h-20 bg-gray-100 rounded animate-pulse" />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-muted-foreground">
                        Record created: {formatDate(record.createdAt)}
                      </div>
                      
                      <div className="flex gap-2">
                        {hasDecryptedData ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportRecord(record._id)}
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Export
                            </Button>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <Shield className="h-4 w-4" />
                              <span>Decrypted</span>
                            </div>
                          </>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleDecryptRecord(record._id, record.encryptedAesKey)}
                            disabled={isDecrypting}
                            className="flex items-center gap-2"
                          >
                            {isDecrypting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Decrypting...
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4" />
                                View Decrypted Record
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Your Data Privacy</h4>
              <p className="text-sm text-green-700 mt-1">
                Your health records are encrypted using military-grade encryption. 
                Only you and authorized healthcare providers can decrypt and view your records. 
                The encryption keys are managed by OpenBao, ensuring your data remains private and secure.
              </p>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                  End-to-end encryption protects your data in transit and at rest
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                  Dual-key architecture ensures only authorized parties can access your data
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                  HIPAA-compliant encryption standards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
