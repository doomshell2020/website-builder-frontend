"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";
interface DefaultProps { project?: User; }

export default function Header({ project }: DefaultProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Our Leadership", to: "/leadership" },
    { label: "Gallery", to: "/gallery" },
    { label: "Contact Us", to: "/contact" },
  ];

  return (
    <header>
      <nav>
        <div className="max-w-[1188px] mx-auto flex items-center justify-between px-6 py-[10px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000/uploads/"}${project?.company_logo}`}
              alt={project?.company_name || "logo"}
              className="max-h-[61px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-[18px]">
            {navLinks.map((item, index) => {
              const isActive =
                item.to === "/"
                  ? pathname === item.to
                  : pathname.startsWith(item.to);
              return (
                <Link
                  key={index}
                  href={item.to}
                  className={`relative font-medium text-lg transition-all duration-300 ${isActive
                    ? "text-[#1199d4] after:w-full"
                    : "text-black hover:text-[#1199d4]"
                    } group`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-[#1199d4] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-between w-6 h-5 focus:outline-none"
          >
            <span
              className={`h-[3px] w-full bg-black rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""
                }`}
            ></span>
            <span
              className={`h-[3px] w-full bg-black rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""
                }`}
            ></span>
            <span
              className={`h-[3px] w-full bg-black rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""
                }`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden flex flex-col bg-white shadow-inner transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-80 py-3" : "max-h-0 py-0"
            }`}
        >
          {navLinks.map((item, index) => {
            const isActive =
              item.to === "/" ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={index}
                href={item.to}
                onClick={() => setMenuOpen(false)}
                className={`relative px-6 py-3 text-base font-medium transition-all duration-300 ${isActive
                  ? "text-blue-600 after:w-full"
                  : "text-black hover:text-blue-600"
                  } group`}
              >
                {item.label}
                <span
                  className={`absolute left-0 bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                ></span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};