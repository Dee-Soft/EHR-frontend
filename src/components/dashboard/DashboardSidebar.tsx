'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Users, 
  FileText, 
  Shield, 
  Settings, 
  LogOut,
  User,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleNavigation = () => {
    switch (user?.role) {
      case 'Admin':
        return [
          { href: '/dashboard/admin', label: 'Admin Dashboard', icon: <Home className="h-4 w-4" /> },
          { href: '/dashboard/admin/register-users', label: 'Register Users', icon: <Users className="h-4 w-4" /> },
          { href: '/dashboard/admin/audit-logs', label: 'Audit Logs', icon: <ClipboardList className="h-4 w-4" /> },
        ];
      case 'Manager':
        return [
          { href: '/dashboard/manager', label: 'Manager Dashboard', icon: <Home className="h-4 w-4" /> },
          { href: '/register/employee', label: 'Register Employee', icon: <Users className="h-4 w-4" /> },
          { href: '/register/provider', label: 'Register Provider', icon: <Stethoscope className="h-4 w-4" /> },
          { href: '/register/patient', label: 'Register Patient', icon: <User className="h-4 w-4" /> },
        ];
      case 'Provider':
        return [
          { href: '/dashboard/provider', label: 'Provider Dashboard', icon: <Home className="h-4 w-4" /> },
          { href: '/dashboard/provider/create-record', label: 'Create Record', icon: <FileText className="h-4 w-4" /> },
          { href: '/dashboard/provider/records', label: 'View Records', icon: <ClipboardList className="h-4 w-4" /> },
        ];
      case 'Employee':
        return [
          { href: '/dashboard/employee', label: 'Employee Dashboard', icon: <Home className="h-4 w-4" /> },
          { href: '/register/patient', label: 'Register Patient', icon: <User className="h-4 w-4" /> },
        ];
      case 'Patient':
        return [
          { href: '/dashboard/patient', label: 'Patient Dashboard', icon: <Home className="h-4 w-4" /> },
          { href: '/dashboard/patient/records', label: 'My Records', icon: <FileText className="h-4 w-4" /> },
        ];
      default:
        return [];
    }
  };

  const navigation = getRoleNavigation();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-green-400" />
          <div>
            <h2 className="text-xl font-bold">EHR System</h2>
            <p className="text-sm text-gray-400">Secure Health Records</p>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="mb-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
        
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}