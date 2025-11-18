"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User } from "lucide-react";
import Navigation from "@/components/ui/Navigation";
import Link from "next/link";
import Logo from '@/components/Logo';
import { logout, getRole } from "@/lib/auth";
import { AdminContext } from "@/lib/adminContext";
import Swal from "sweetalert2";

const Header = () => {
  const router = useRouter();
  const { name, id } = useContext(AdminContext);

  // 🚀 New: load instantly without useEffect delay
  const [initialName] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("name") : name
  );

  const [initialRole] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("role") : getRole?.()
  );

  const profileRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccountClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const role = initialRole;
    if (!role) return;

    router.push(
      role === "1"
        ? `/admin/myaccount/edit/${id}`
        : `/user/myaccount/edit/${id}`
    );

    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    });

    if (result.isConfirmed) {
      try {
        await logout?.();
      } catch {
        Swal.fire("Error!", "Failed to logout.", "error");
      }
    }
  };

  return (
    <>
      <header className="bg-[#293042] text-xs p-4 border-b">
        <div className="flex justify-between items-center">
          <Logo className="justify-center" />

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-white text-sm hover:underline">
                {initialName || name || "User"}
              </span>
              <ChevronDown size={16} className="text-white" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <Link
                    href="#myaccount"
                    className="block px-4 py-2 text-sm hover:bg-blue-500 text-gray-900 transition-colors"
                    onClick={handleAccountClick}
                  >
                    My Account
                  </Link>

                  <Link
                    href="#logout"
                    className="block px-4 py-2 text-sm hover:bg-blue-500 text-gray-900"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <Navigation />
    </>
  );
};

export default Header;