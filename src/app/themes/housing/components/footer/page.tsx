"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Label } from "@/components/ui/Label";
import { Mail, MapPin, Phone } from 'lucide-react';
interface DefaultProps { project?: User };
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const quickLinks = [
  { label: "About", to: "/about" },
  { label: "Our Leadership", to: "/leadership" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact Us", to: "/contact" },
];

const contactInfo = [
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "7240230171",
    type: "text",
  }, {
    icon: MailIcon,
    label: "Email",
    value: "contact@navvistarinfra.com",
    type: "email",
    href: "mailto:contact@navvistarinfra.com",
  }, {
    icon: MapPinIcon,
    label: "Address",
    value: "302, okey plus square, Patel marg , Mansarover , Jaipur 302020",
    type: "text",
  },
];

export default function Footer({ project }: DefaultProps) {
  const router = useRouter();
  return (
    <footer className="flex flex-col w-full">
      <div className="flex flex-wrap items-start gap-[50px] px-20 py-[52px] w-full bg-[#1b1b1b] justify-center">
        <div className="w-full max-w-[585px] flex flex-col items-start gap-6 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
          <Link
            className="inline-flex flex-col items-start gap-2.5"
            href="/navvstaru45homeu45page"
          >
            <img
              className="w-[177px] h-[146px] object-cover"
              alt="Navvistar Infra Logo"
              src="https://c.animaapp.com/miu4qofhUHi324/img/image-30-4.png"
            />
          </Link>

          <p className="w-full font-manropemedium-22 font-[number:var(--manropemedium-22-font-weight)] text-white text-[length:var(--manropemedium-22-font-size)] tracking-[var(--manropemedium-22-letter-spacing)] leading-[var(--manropemedium-22-line-height)] [font-style:var(--manropemedium-22-font-style)]">
            Founded on July 28, 2025, NAVVISTAR INFRA PVT. LTD. is a visionary
            new construction company built on ambition, innovation, and a
            commitment to excellence.
          </p>
        </div>

        <div className="flex flex-wrap w-full max-w-[645px] items-start gap-20">
          <nav className="inline-flex flex-col items-start gap-[18px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <h3 className="w-[158px] font-inter-24 font-[number:var(--inter-24-font-weight)] text-white text-[length:var(--inter-24-font-size)] tracking-[var(--inter-24-letter-spacing)] leading-[var(--inter-24-line-height)] [font-style:var(--inter-24-font-style)]">
              Quick Links
            </h3>

            {quickLinks.map((link, index) => (
              <Link
                key={index}
                className="w-[158px] font-manropemedium-22 font-[number:var(--manropemedium-22-font-weight)] text-white text-[length:var(--manropemedium-22-font-size)] tracking-[var(--manropemedium-22-letter-spacing)] leading-[var(--manropemedium-22-line-height)] [font-style:var(--manropemedium-22-font-style)] transition-opacity hover:opacity-80"
                href={link.to}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col w-full max-w-[407px] items-start gap-[22px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            <h3 className="w-full font-inter-24 font-[number:var(--inter-24-font-weight)] text-white text-[length:var(--inter-24-font-size)] tracking-[var(--inter-24-letter-spacing)] leading-[var(--inter-24-line-height)] [font-style:var(--inter-24-font-style)]">
              Contact Info
            </h3>

            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <div key={index} className="flex w-full items-start gap-[22px]">
                  <IconComponent className="w-6 h-6 text-white flex-shrink-0" />

                  <div className="flex flex-col items-start flex-1">
                    <span className="font-manropemedium-22 font-[number:var(--manropemedium-22-font-weight)] text-white text-[length:var(--manropemedium-22-font-size)] tracking-[var(--manropemedium-22-letter-spacing)] leading-[var(--manropemedium-22-line-height)] [font-style:var(--manropemedium-22-font-style)]">
                      {contact.label}
                    </span>

                    {contact.type === "email" ? (
                      <a
                        href={contact.href}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="w-full font-manrope-20 font-[number:var(--manrope-20-font-weight)] text-white text-[length:var(--manrope-20-font-size)] tracking-[var(--manrope-20-letter-spacing)] leading-[var(--manrope-20-line-height)] [font-style:var(--manrope-20-font-style)] underline transition-opacity hover:opacity-80"
                      >
                        {contact.value}
                      </a>
                    ) : (
                      <span className="w-full font-manrope-20 font-[number:var(--manrope-20-font-weight)] text-white text-[length:var(--manrope-20-font-size)] tracking-[var(--manrope-20-letter-spacing)] leading-[var(--manrope-20-line-height)] [font-style:var(--manrope-20-font-style)]">
                        {contact.value}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-[10px] px-[104px] py-4 w-full bg-[#161212]">
        <p className="font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-white text-[length:var(--interregular-20-font-size)] tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] whitespace-nowrap">
          Copyright © 2025 Navvistar infra : All Rights Reserved.
        </p>

        <p className="font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-white text-[length:var(--interregular-20-font-size)] tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] whitespace-nowrap">
          Designed By:{" "}
          <a
            href="http://doomshell.com/"
            rel="noopener noreferrer"
            target="_blank"
            className="transition-opacity hover:opacity-80"
          >
            Doomshell.com
          </a>
        </p>
      </div>
    </footer>
  );
};