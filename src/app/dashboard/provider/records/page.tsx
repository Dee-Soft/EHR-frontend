'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/auth/RequireAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileText,
  AlertCircle,
  Loader2,
  Plus,
  Eye
} from 'lucide-react';
import api from '@/lib/api';
import { decryptPatientRecord } from '@/lib/crypto/encryptionService';

interface PatientRecord {
  _id: string;
  patient: {
    _id: string;
    name: string;
    email: string;
  };
  diagnosis: string;
  notes: string;
  medications: string;
  visitDate: string;
  createdAt: string;
  encryptedAesKey: string;
  encryptionMetadata: {
    algorithm: string;
    keyId: string;
    encryptedAt: string;
  };
}

export default function ProviderRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [decrypting, setDecrypting] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetchPatientRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [searchTerm, records, filterRecords]);

  const fetchPatientRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch patient records for the provider
      const response = await api.get('/patient-records/assigned');
      setRecords(response.data || []);
    } catch (err: unknown) {
      console.error('Failed to fetch patient records:', err);
      setError('Unable to load patient records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredRecords(records);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = records.filter(record =>
      record.patient.name.toLowerCase().includes(term) ||
      record.patient.email.toLowerCase().includes(term) ||
      record.diagnosis.toLowerCase().includes(term) ||
      record.visitDate.includes(term)
    );
    
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const handleDecryptRecord = async (recordId: string, encryptedAesKey: string) => {
    try {
      setDecrypting(recordId);
      
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
      month: 'short',
      day: 'numeric',
    });
  };

  const getEncryptionBadge = (algorithm: string) => {
    switch (algorithm) {
      case 'aes256-gcm96':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            AES-256-GCM
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Shield className="h-3 w-3 mr-1" />
            {algorithm}
          </Badge>
        );
    }
  };

  return (
    <RequireAuth allowedRoles={['Provider', 'Admin']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Patient Records
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage encrypted patient health records. Click on a record to view decrypted details.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/provider')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              onClick={() => router.push('/dashboard/provider/create-record')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Record
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name, email, diagnosis, or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {filteredRecords.length} of {records.length} records
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Loading patient records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No records found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? 'Try a different search term' : 'No patient records available yet'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => router.push('/dashboard/provider/create-record')}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Record
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record) => {
              const isDecrypting = decrypting === record._id;
              const hasDecryptedData = !!decryptedData[record._id];
              const decrypted = decryptedData[record._id];

              return (
                <Card key={record._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          {record.patient.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {record.patient.email}
                        </p>
                      </div>
                      {getEncryptionBadge(record.encryptionMetadata?.algorithm || 'aes256-gcm96')}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(record.visitDate)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(record.createdAt)}
                      </span>
                    </div>

                    {hasDecryptedData ? (
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Diagnosis</h4>
                          <p className="text-sm bg-blue-50 p-2 rounded border border-blue-100">
                            {decrypted.diagnosis || 'Not specified'}
                          </p>
                        </div>
                        
                        {decrypted.notes && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Notes</h4>
                            <p className="text-sm bg-gray-50 p-2 rounded border border-gray-100">
                              {decrypted.notes}
                            </p>
                          </div>
                        )}
                        
                        {decrypted.medications && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Medications</h4>
                            <p className="text-sm bg-green-50 p-2 rounded border border-green-100 whitespace-pre-wrap">
                              {decrypted.medications}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      {hasDecryptedData ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Shield className="h-4 w-4" />
                          <span>Decrypted and secure</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecryptRecord(record._id, record.encryptedAesKey)}
                          disabled={isDecrypting}
                          className="w-full"
                        >
                          {isDecrypting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Decrypting...
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Decrypt Record
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">About Record Encryption</h4>
              <p className="text-sm text-blue-700 mt-1">
                Patient records are encrypted using OpenBao&apos;s dual-key architecture. 
                When you click &quot;Decrypt Record&quot;, the data is securely decrypted on your device 
                using keys managed by OpenBao. The backend never has access to plaintext patient data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
