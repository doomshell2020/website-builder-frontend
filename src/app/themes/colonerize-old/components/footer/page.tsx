"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Label } from "@/components/ui/Label";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
interface DefaultProps { project?: User; };

const navigationItems = [
  { label: "About", to: "/about" },
  { label: "Our Leadership", to: "/leadership" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact Us", to: "/contact" },
];

export default function Footer({ project }: DefaultProps) {
  const router = useRouter();
  return (
    <footer>
      <div className="flex flex-col items-center justify-center bg-[#000216] text-white px-6 sm:px-10 lg:px-[120px] py-8 sm:py-16 gap-10 w-full">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <img
            className="w-[200px] sm:w-[250px] h-auto object-contain"
            alt="Navlok Logo"
            src="https://c.animaapp.com/mhd81w7aWvI44g/img/image-6-4.png"
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {navigationItems.map((link, index) => (
            <Link
              key={index}
              href={link.to}
              className="relative group text-white text-base sm:text-lg font-medium tracking-wide"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

      </div>
      {/* Divider */}
      {/* <div className="w-full h-px bg-white/10 mt-4 mb-2"></div> */}

      {/* Bottom Section */}
      {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 w-full text-sm sm:text-base">
        <p className="text-gray-400 text-center sm:text-left">
          Copyright © {new Date().getFullYear()} {project?.company_name}: All Rights Reserved.
        </p>

        // Social Links 
        <div className="flex items-center gap-5">
          <Link
            href={project?.fburl ?? "#"}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Link>
          <Link
            href={project?.instaurl ?? "#"}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Link>
          <Link
            href={project?.xurl ?? "#"}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Link>
          <Link
            href={project?.linkedinurl ?? "#"}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Link>
        </div> 
      </div> */}
      <div className="w-full bg-[#000214] flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 py-4">
        <p className="text-white text-sm text-center md:text-left">
          Copyright © {new Date().getFullYear()} Navlok: All Rights Reserved.
          {/* {project?.company_name} */}
        </p>
        <p className="text-white text-sm md:mt-0 text-center md:text-right">
          Designed by {" "}
          <Link
            href="http://doomshell.com/"
            target="_blank"
            className="text-blue-500 hover:text-blue-300 underline font-noraml"
          >
            Doomshell.com
          </Link>
        </p>
      </div>
    </footer>
  );
};