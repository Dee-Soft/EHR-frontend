import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import EncryptionStatus from '@/components/security/EncryptionStatus';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <EncryptionStatus />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
