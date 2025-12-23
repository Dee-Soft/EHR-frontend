import type { Metadata } from 'next';
import './globals.css';
import Layout from '@/components/layout/Layout';
import AppProviders from '@/components/providers/AppProviders';

/**
 * Application metadata for SEO and browser display.
 */
export const metadata: Metadata = {
  title: 'Electronic Health Record System',
  description: 'Secure and HIPAA-compliant EHR system',
};

/**
 * Root layout component that wraps the entire application.
 * Provides HTML structure, global providers, and main layout.
 */
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