import type { Metadata } from 'next';
import './globals.css';
import Layout from '@/components/layout/Layout';
import AppProviders from '@/components/providers/AppProviders';

export const metadata: Metadata = {
  title: 'Electronic Health Record System',
  description: 'Secure and HIPAA-compliant EHR system with dual-key encryption',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Layout>{children}</Layout>
        </AppProviders>
      </body>
    </html>
  );
}