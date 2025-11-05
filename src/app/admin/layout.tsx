'use client';

import React, { use, useEffect, useState } from 'react';
// import Sidebar from '@/components/AdminLayout/Sidebar';
import Header from '@/components/AdminLayout/Header';
import { AdminProvider } from "@/lib/adminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = () => {
    setCollapsed(prev => !prev);
  };

  // useEffect(() => {
  //   handleToggle();
  //   console.log('AdminLayout rendered', collapsed);
  // }, []);

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