'use client';

import React from 'react';
import Header from '@/components/AdminLayout/Header';
import { AdminProvider } from "@/lib/adminContext";

export default function UserLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex min-h-screen">
      <AdminProvider>
        <div className="flex-1">
          <Header />
          <main className="p-0">{children}</main>
        </div>
      </AdminProvider>
    </div>
  );
};