"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Menu, X } from "lucide-react";
interface DefaultProps { project?: User; }

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact Us", to: "/contact" },
];

export default function Header({ project }: DefaultProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg transition-all duration-500 ${isScrolled ? "bg-white shadow-md backdrop-blur-none" : "bg-white/10 "
        }`}
    >
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
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="h-auto p-0 hover:bg-transparent relative group"
              asChild
            >
              <Link
                href={item.to}
                onClick={() => handleNavClick(item.to)}
                className={`font-normal text-xl transition-colors duration-300 ${activeLink === item.to
                  ? "text-red-500"
                  : "text-black hover:text-red-500"
                  } ${isScrolled ? "text-black " : " text-white"
                  }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 bottom-[-4px] h-[2px] transition-all duration-300 ${activeLink === item.to
                    ? "w-full bg-red-500"
                    : "w-0 group-hover:w-full bg-red-500"
                    }`}
                ></span>
              </Link>
            </Button>
          ))}

          <Link href="/contact">
            <div className="bg-red-500 px-4 py-2 hover:bg-red-700 text-lg font-medium text-white rounded-full text-center cursor-pointer transition-colors">
              Get a Quote
            </div>
          </Link>

        </nav>

        {/* Mobile Menu Button */}
        <Button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col items-center bg-white border-t border-gray-200 shadow-lg animate-slide-down">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.to}
              onClick={() => handleNavClick(item.to)}
              className={`w-full text-center py-3 text-lg font-medium transition ${activeLink === item.to
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-800 hover:bg-gray-100"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>


  );
};