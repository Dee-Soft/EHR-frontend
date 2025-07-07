'use client';

import Link from 'next/link';

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-semibold mb-4">Navigation</h2>
      <nav className="space-y-2">
        <Link href="/dashboard/admin" className="block hover:bg-gray-700 p-2 rounded">
          Admin Dashboard
        </Link>
        <Link href="/dashboard/manager" className="block hover:bg-gray-700 p-2 rounded">
          Manager Dashboard
        </Link>
        <Link href="/dashboard/provider" className="block hover:bg-gray-700 p-2 rounded">
          Provider Dashboard
        </Link>
        <Link href="/dashboard/patient" className="block hover:bg-gray-700 p-2 rounded">
          Patient Dashboard
        </Link>
        <Link href="/dashboard/employee" className="block hover:bg-gray-700 p-2 rounded">
          Employee Dashboard
        </Link>
      </nav>
    </aside>
  );
}