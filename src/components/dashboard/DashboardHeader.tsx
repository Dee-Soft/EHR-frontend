'use client';

import { Button } from '@/components/ui/button';

export default function DashboardHeader() {
  return (
    <header className="flex justify-between items-center bg-gray-100 p-4 shadow">
      <h1 className="text-2xl font-bold">Electronic Health Record System</h1>
      <Button variant="outline">Logout</Button>
    </header>
  );
}