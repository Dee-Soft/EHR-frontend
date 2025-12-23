import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Main layout component that wraps page content with header and footer.
 * Provides consistent page structure across the application.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
}
