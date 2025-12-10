"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation"; // ✅ To detect current route
import { User } from "@/types/user";
import { Menu, X } from "lucide-react";
interface DefaultProps { project?: User; }

export default function Header({ project }: DefaultProps) {
  const pathname = usePathname(); // ✅ Current URL path
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigationItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Our Leadership", to: "/leadership" },
    { label: "Gallery", to: "/gallery" },
    { label: "Contact Us", to: "/contact" },
  ];

  return (

    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-3 lg:px-10">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            {/* <div className="max-h-14 w-auto max-w-[150px] flex items-center"> */}
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000/uploads/"}${project?.company_logo}`}
              alt={project?.company_name || "logo"}
              className="max-h-14 w-auto object-contain"
            />
            {/* </div> */}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navigationItems.map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              className="h-auto p-0 hover:bg-transparent relative group"
              asChild
            >
              <Link href={item.to}>
                <span className="font-normal text-black text-xl">
                  {item.label}
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col items-center bg-white border-t border-gray-200 shadow-lg animate-slide-down">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.to}
              className="w-full text-center py-3 text-gray-800 text-lg font-medium hover:bg-gray-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>


  );
};
