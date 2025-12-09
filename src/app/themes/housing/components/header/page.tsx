"use client";

import React, { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";
interface DefaultProps { project?: User; }

export default function Header({ project }: DefaultProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigationLinks = [
    { label: "Home", to: "/", },
    { label: "About", to: "/about", },
    { label: "Our Leadership", to: "/leadership", },
    { label: "Gallery", to: "/gallery", },
    { label: "Contact Us", to: "/contact", },
  ];

  return (
    <header>
      <nav className="flex flex-wrap items-center justify-between gap-[0px_0px] px-[45px] py-3.5 w-full bg-white">
        <Link
          className="inline-flex flex-col items-start gap-2.5 flex-[0_0_auto] translate-y-[-1rem] animate-fade-in opacity-0"
          href="/navvstaru45homeu45page"
        >
          <img
            className="w-[86px] h-[71px] object-cover"
            alt="Navvstar Logo"
            src="https://c.animaapp.com/miu4qofhUHi324/img/image-30-4.png"
          />
        </Link>

        <ul className="inline-flex items-center justify-end gap-[26px] flex-[0_0_auto]">
          {navigationLinks.map((link, index) => (
            <li
              key={link.to}
              className="translate-y-[-1rem] animate-fade-in opacity-0"
              style={
                {
                  "--animation-delay": `${(index + 1) * 100}ms`,
                } as CSSProperties
              }            >
              <Link
                className="inline-flex items-center justify-center gap-2.5 transition-colors hover:text-primary"
                href={link.to}
              >
                <span className="w-fit mt-[-1.00px] font-poppins-22 font-[number:var(--poppins-22-font-weight)] text-[#2a2a2a] text-[length:var(--poppins-22-font-size)] tracking-[var(--poppins-22-letter-spacing)] leading-[var(--poppins-22-line-height)] [font-style:var(--poppins-22-font-style)]">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};