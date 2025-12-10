"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Label } from "@/components/ui/Label";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
interface DefaultProps { project?: User; };

const navigationLinks = [
  { label: "About", isBold: true },
  { label: "Our Leadership", isBold: false },
  { label: "Gallery", isBold: false },
  { label: "Contact Us", isBold: false },
];

export default function Footer({ project }: DefaultProps) {
  const router = useRouter();
  return (
    <footer className="flex flex-col justify-center gap-20 pt-[84px] pb-[18px] px-[120px] bg-bgToken w-full">
      <div className="flex items-center gap-6 w-full flex-col">
        <div className="inline-flex items-start gap-2.5 flex-col opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:0ms]">
          <img
            className="w-[250px] h-[118px] object-cover"
            alt="Navlok Logo"
            src="https://c.animaapp.com/mijuqzb08ywwmN/img/image-6.png"
          />
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 w-full opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]">
          {navigationLinks.map((link, index) => (
            <Link
              key={index}
              href="#"
              className="inline-flex items-center justify-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <span
                className={`text-primary-white text-[length:var(--text-lg-500-font-size)] tracking-[var(--text-lg-500-letter-spacing)] leading-[var(--text-lg-500-line-height)] [font-style:var(--text-lg-500-font-style)] ${link.isBold
                  ? "font-text-semibold-lg font-[number:var(--text-semibold-lg-font-weight)]"
                  : "font-text-lg-500 font-[number:var(--text-lg-500-font-weight)]"
                  }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-wrap justify-between gap-6 items-center w-full opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:400ms]">
        <div className="inline-flex items-center justify-center gap-2.5">
          <p className="font-text-md-400 font-[number:var(--text-md-400-font-weight)] text-primary-white text-[length:var(--text-md-400-font-size)] tracking-[var(--text-md-400-letter-spacing)] leading-[var(--text-md-400-line-height)] whitespace-nowrap [font-style:var(--text-md-400-font-style)]">
            Copyright © 2025 Navlok : All Rights Reserved.
          </p>
        </div>

        <div className="inline-flex items-center justify-center gap-2.5">
          <p className="font-text-md-400 font-[number:var(--text-md-400-font-weight)] text-primary-white text-[length:var(--text-md-400-font-size)] tracking-[var(--text-md-400-letter-spacing)] leading-[var(--text-md-400-line-height)] whitespace-nowrap [font-style:var(--text-md-400-font-style)]">
            Designed by Doomshell.com
          </p>
        </div>
      </div>
    </footer>
  );
};