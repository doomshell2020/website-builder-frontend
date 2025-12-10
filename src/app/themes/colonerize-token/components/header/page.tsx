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
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Our Leadership", href: "#leadership" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact Us", href: "#contact" },
  ];

  return (<header className="flex flex-wrap items-center justify-between gap-8 px-10 py-3 w-full bg-primary-white opacity-0 animate-fade-in">
    <div className="inline-flex flex-col items-start gap-2.5">
      <img
        className="w-[144.47px] h-[67.9px] object-cover"
        alt="Navlok Logo"
        src="https://c.animaapp.com/mijuqzb08ywwmN/img/image-1.png"
      />
    </div>

    <nav className="inline-flex items-center justify-end gap-5">
      {navigationItems.map((item, index) => (
        <Button
          key={item.label}
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent opacity-0 animate-fade-in"
          style={
            {
              "--animation-delay": `${(index + 1) * 100}ms`,
            } as React.CSSProperties
          }
          asChild
        >
          <Link
            href={item.href}
            className="font-text-xl font-[number:var(--text-xl-font-weight)] text-primary-black text-[length:var(--text-xl-font-size)] tracking-[var(--text-xl-letter-spacing)] leading-[var(--text-xl-line-height)] [font-style:var(--text-xl-font-style)] transition-colors hover:text-blue-color"
          >
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  </header>
  );
};
