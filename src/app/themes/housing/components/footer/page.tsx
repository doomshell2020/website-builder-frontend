"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Label } from "@/components/ui/Label";
import { Mail, MapPin, Phone } from 'lucide-react';

interface DefaultProps { project?: User };

const menuItems = [
  { label: "About", href: "/about" },
  { label: "Our Leadership", href: "/leadership" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer({ project }: DefaultProps) {
  const router = useRouter();
  return (
    <footer>
      {/* Top Section */}
      <div className="w-full bg-[#1b1b1b] text-white  px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12 lg:gap-16 justify-center items-start ">
          {/* Logo + Description */}
          <div>
            <img
              src={(project?.company_logo)
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${project?.company_logo}`
                : "https://c.animaapp.com/mghk811dbdG4xS/img/image-30-5.png"}
              alt="Navvistar Logo"
              className="w-28 h-auto mb-4"
            />
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Founded on July 28, 2025, NAVVISTAR INFRA PVT. LTD. is a visionary new
              construction company built on ambition, innovation, and a commitment to excellence.
            </p>
          </div>

          {/* Quick Links */}

          <div >
            <h3 className="text-xl font-medium mb-5 text-white">Quick Links</h3>
            <ul className="space-y-3 text-base">
              {menuItems.map((item, idx) => (
                <li
                  key={idx}
                  className="relative w-fit cursor-pointer transition-colors duration-300 
                     after:content-[''] after:absolute after:left-0 after:bottom-0 
                     after:w-0 after:h-[2px] after:bg-blue-400 hover:after:w-full 
                     after:transition-all after:duration-300"
                >
                  <Link
                    href={item.href}
                    className="block text-white hover:text-blue-500 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-medium mb-5 text-white">Contacts</h3>
            <ul className="space-y-4 text-base">
              <li className="flex items-center gap-3">
                <img
                  src="https://c.animaapp.com/mghk811dbdG4xS/img/phone-fill.svg"
                  alt="Phone"
                  className="w-8 h-8 "
                />
                {/* <Phone size={28} strokeWidth={2.5} /> */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="" className="text-[16px] text-white">Phone</Label>
                  <Link href={'#'} className="text-white">
                    {project?.mobile_no || "9988998899"}
                  </Link>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <img
                  src="https://c.animaapp.com/mghk811dbdG4xS/img/chat-unread-fill.svg"
                  alt="Email"
                  className="w-8 h-8"
                />
                {/* <Mail size={28} strokeWidth={2.5} /> */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="" className="text-[16px] text-white">Email</Label>
                  <Link href={'#'} className=" text-white ">
                    {project?.email || "contact@company.com"}
                  </Link>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <img
                  src="https://c.animaapp.com/mghk811dbdG4xS/img/map-pin-2-fill.svg"
                  alt="Location"
                  className="w-8 h-8 mt-1"
                />
                {/* <MapPin size={28} strokeWidth={2.5} /> */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="" className="text-[16px] text-white">Address</Label>
                  <Link href={'#'} className=" text-white leading-snug">
                    {project?.address1 || "Rajasthan"}
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full bg-[#191919] flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 py-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm text-center md:text-left">
          Copyright © {new Date().getFullYear()} <span className="text-white font-semibold">{project?.company_name}</span> : All Rights Reserved.
        </p>
        <p className="text-gray-400 text-sm mt-2 md:mt-0 text-center md:text-right">
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