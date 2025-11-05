
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
interface AdminLayoutProps {
  children: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
