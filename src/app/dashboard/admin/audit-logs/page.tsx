'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { AuditLog } from '@/types/auditLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await api.get('/admin/audit-logs');
        setLogs(res.data);
      } catch (err: unknown) {
        setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch audit logs');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 grid gap-6">
      {logs.map((log) => (
        <Card key={log._id}>
          <CardHeader>
            <CardTitle>{log.action}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{log.details}</p>
            <p className="text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}