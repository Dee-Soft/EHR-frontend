import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Stethoscope, User, Building } from 'lucide-react';

/**
 * Home page component displaying role-based login options.
 * Provides entry points for different user roles in the EHR system.
 */
export default function HomePage() {
  const roles = [
    {
      title: 'Administrator',
      description: 'Full system access, user management, audit logs',
      icon: Shield,
      color: 'bg-red-50 text-red-700 border-red-200',
      iconColor: 'text-red-600',
      href: '/auth/login/admin',
    },
    {
      title: 'Manager',
      description: 'Manage employees, providers, and patient assignments',
      icon: Building,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
      href: '/auth/login/manager',
    },
    {
      title: 'Employee',
      description: 'Register patients and manage basic information',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-blue-600',
      href: '/auth/login/employee',
    },
    {
      title: 'Healthcare Provider',
      description: 'Create and view encrypted patient health records',
      icon: Stethoscope,
      color: 'bg-green-50 text-green-700 border-green-200',
      iconColor: 'text-green-600',
      href: '/auth/login/provider',
    },
    {
      title: 'Patient',
      description: 'View your personal health records securely',
      icon: User,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      iconColor: 'text-orange-600',
      href: '/auth/login/patient',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Electronic Health Record System</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Secure, HIPAA-compliant healthcare management with end-to-end encryption
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {roles.map((role) => (
          <Card key={role.title} className={`hover:shadow-lg transition-shadow ${role.color} border-2`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <role.icon className={`h-6 w-6 ${role.iconColor}`} />
                <span>{role.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">{role.description}</p>
              <Link href={role.href}>
                <Button className="w-full" variant="outline">
                  Login as {role.title.split(' ')[0]}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                <span><strong>End-to-End Encryption:</strong> Patient data is encrypted before leaving your device</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                <span><strong>Role-Based Access Control:</strong> Strict permissions based on user roles</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                <span><strong>Audit Logging:</strong> All sensitive operations are logged and monitored</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5" />
                <span><strong>HIPAA Compliance:</strong> Designed to meet healthcare privacy standards</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Check if all system components are running properly:</p>
            <Link href="/system-status">
              <Button className="w-full" variant="outline">
                View System Status
              </Button>
            </Link>
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">Required services:</p>
              <ul className="space-y-1">
                <li>• EHR Backend API (port 3001)</li>
                <li>• OpenBao Encryption Service (port 18200)</li>
                <li>• MongoDB Database</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
