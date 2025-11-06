"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { AdminProfile } from "@/services/admin.service";
import { logout } from "@/lib/auth";

interface AdminContextType {
  id: number | null;
  name: string | null;
  setAdmin: (id: number, name: string) => void;
  loading: boolean;
}

export const AdminContext = createContext<AdminContextType>({
  id: null,
  name: null,
  setAdmin: () => { },
  loading: true,
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchAdminProfile = async () => {
      try {
        const res = await AdminProfile();
        console.log("🟢 Admin Profile Response:", res);

        if (!isActive) return;
        const { id, name } = res?.result || {};
        setId(id);
        setName(name);
      } catch (error: any) {
        console.error("🔴 Admin Profile Error:", error?.message || error);
        logout?.();
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchAdminProfile();

    return () => {
      isActive = false;
    };
  }, []);
  const setAdmin = (id: number, name: string) => {
    setId(id);
    setName(name);
  };

  return (
    <AdminContext.Provider value={{ id, name, setAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};