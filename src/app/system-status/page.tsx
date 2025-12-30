'use client';

import { useState, useEffect } from 'react';
import { testService } from '@/lib/services/testService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Server, 
  Shield, 
  User,
  Loader2
} from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  details?: unknown;
}

export default function SystemStatusPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    backend: TestResult;
    openbao: TestResult;
    auth: TestResult;
    allPassed: boolean;
  } | null>(null);

  const runTests = async () => {
    setLoading(true);
    try {
      const testResults = await testService.runAllTests();
      setResults(testResults);
    } catch (error) {
      console.error('Failed to run tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const TestCard = ({ 
    title, 
    icon: Icon, 
    result 
  }: { 
    title: string; 
    icon: React.ComponentType<{ className?: string }>;
    result?: TestResult 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant={result.success ? "default" : "destructive"}>
                {result.success ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    PASS
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    FAIL
                  </>
                )}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm">{result.message}</p>
            {result.details && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground">
                  View details
                </summary>
                <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto max-h-40">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Testing...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Status</h1>
        <p className="text-muted-foreground mt-2">
          Check the health and connectivity of all system components.
        </p>
      </div>

      {results && (
        <Alert className="mb-6" variant={results.allPassed ? "default" : "destructive"}>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {results.allPassed 
                ? 'All systems operational' 
                : 'Some systems are experiencing issues'}
            </span>
            <Badge variant={results.allPassed ? "default" : "destructive"}>
              {results.allPassed ? 'HEALTHY' : 'ISSUES DETECTED'}
            </Badge>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <TestCard 
          title="Backend API" 
          icon={Server} 
          result={results?.backend} 
        />
        <TestCard 
          title="OpenBao Encryption" 
          icon={Shield} 
          result={results?.openbao} 
        />
        <TestCard 
          title="Authentication" 
          icon={User} 
          result={results?.auth} 
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium mb-2">Environment Information</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Backend URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}</p>
            <p>• OpenBao URL: {process.env.NEXT_PUBLIC_OPENBAO_URL || 'Not set'}</p>
            <p>• Encryption: {process.env.NEXT_PUBLIC_ENCRYPTION_ENABLED === 'true' ? 'Enabled' : 'Disabled'}</p>
            <p>• Environment: {process.env.NODE_ENV || 'development'}</p>
          </div>
        </div>
        
        <Button 
          onClick={runTests} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Run Tests Again
            </>
          )}
        </Button>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Troubleshooting Tips</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
            <span>
              <strong>Backend API failing?</strong> Ensure the EHR backend Docker container is running on port 3001.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
            <span>
              <strong>OpenBao failing?</strong> Ensure the OpenBao Docker container is running on port 18200.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
            <span>
              <strong>Authentication failing?</strong> Try logging in again or check if your session has expired.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
            <span>
              <strong>Check Docker containers:</strong> Run <code className="bg-blue-100 px-1 rounded">docker ps</code> to see running containers.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
