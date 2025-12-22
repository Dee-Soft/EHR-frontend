'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useEncryption } from '@/context/EncryptionProvider';
import { getAPIEncryptionStatus } from '@/lib/api';

export default function EncryptionStatus() {
  const { encryptionAvailable, openBaoHealthy, loading, error, checkHealth } = useEncryption();
  const [apiStatus, setApiStatus] = useState<{
    apiConnected: boolean;
    encryptionEnabled: boolean;
    openBaoHealthy: boolean;
  } | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkOverallStatus();
  }, [checkOverallStatus]);

  const checkOverallStatus = useCallback(async () => {
    setChecking(true);
    try {
      const status = await getAPIEncryptionStatus();
      setApiStatus(status);
      await checkHealth();
    } catch (err) {
      console.error('Failed to check overall status:', err);
    } finally {
      setChecking(false);
    }
  }, [checkHealth]);

  const getOverallStatus = () => {
    if (loading || checking) return 'checking';
    if (!encryptionAvailable || !openBaoHealthy) return 'unhealthy';
    if (apiStatus && (!apiStatus.apiConnected || !apiStatus.encryptionEnabled)) return 'unhealthy';
    return 'healthy';
  };

  const overallStatus = getOverallStatus();

  if (overallStatus === 'checking') {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg ${overallStatus === 'healthy' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {overallStatus === 'healthy' ? (
            <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
          )}
          <div>
            <h4 className="font-medium flex items-center gap-2">
              {overallStatus === 'healthy' ? 'Encryption Active' : 'Encryption Issues'}
              <Badge variant={overallStatus === 'healthy' ? 'default' : 'destructive'}>
                {overallStatus === 'healthy' ? 'Secure' : 'Unsecure'}
              </Badge>
            </h4>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${openBaoHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">OpenBao: {openBaoHealthy ? 'Connected' : 'Disconnected'}</span>
              </div>
              
              {apiStatus && (
                <>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${apiStatus.apiConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">Backend API: {apiStatus.apiConnected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${apiStatus.encryptionEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">Encryption: {apiStatus.encryptionEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-3">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={checkOverallStatus}
          disabled={checking}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-3 w-3 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking...' : 'Refresh'}
        </Button>
      </div>

      {overallStatus === 'healthy' && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-sm text-green-700">
            <Shield className="h-4 w-4 inline mr-1" />
            Your data is protected with end-to-end encryption using OpenBao&apos;s dual-key architecture.
          </p>
        </div>
      )}

      {overallStatus !== 'healthy' && (
        <div className="mt-4 pt-4 border-t border-red-200">
          <p className="text-sm text-red-700">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            Some security features are unavailable. Patient data may not be fully encrypted.
          </p>
        </div>
      )}
    </div>
  );
}
