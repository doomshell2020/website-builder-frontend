"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
interface DefaultProps { project?: User; };

const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Service", to: "/services" },
  { label: "Contact Us", to: "/contact" },
];
const UsefulLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Disclaimer", to: "/disclaimer" },
];

export default function Footer({ project }: DefaultProps) {
  const router = useRouter();
  return (
    <footer className="flex flex-col w-full items-center relative">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:flex-wrap items-start justify-between gap-8  pt-16 md:pt-[100px] pb-10 md:pb-[70px] px-6 md:px-10 w-full bg-[#c2302e]">
        {/* Logo + Description */}
        <div className="flex flex-col w-full md:w-[312px] items-center md:items-start justify-center gap-6 text-center md:text-left">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* <div className="max-h-14 w-auto max-w-[150px] flex items-center"> */}
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000/uploads/"}${project?.company_logo}`}
                alt={project?.company_name || "logo"}
                className="w-[140px] md:w-[155px] h-auto object-cover"
              />
              {/* </div> */}
            </Link>
          </div>

          <p className="font-semibold text-white leading-normal text-base md:text-[16px]">
            Jaipur Food Caterers is a unit of Prabhu Narayan Halwai. Jaipur
            Food Caterers is a brand name of 100% pure vegetable catering
            Industry serving valuable customers since 1974. Jaipur Food
            Caterers was founded by Sh....
          </p>
        </div>

        {/* Quick Links */}
        <nav className="flex flex-col w-full sm:w-[200px] items-start justify-center gap-3.5">
          <h3 className="font-bold text-white text-xl md:text-2xl leading-normal">
            Quick Links
          </h3>

          {navigationLinks.map((link, index) => (
            <Link
              key={index}
              href={link.to}
              className="group flex items-center gap-[5px] transition-all duration-300 hover:translate-x-2"
            >
              <img
                className="flex-shrink-0 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                alt=""
                src="https://c.animaapp.com/mhfz0577zdQtqk/img/radio-button-line.svg"
              />
              <span className="font-semibold text-white text-base leading-normal transition-all duration-300 group-hover:opacity-90">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Useful Links */}
        <nav className="flex flex-col w-full sm:w-[250px] items-start justify-center gap-3.5">
          <h3 className="font-bold text-white text-xl md:text-2xl leading-normal">
            Useful Links
          </h3>

          {UsefulLinks.map((link, index) => (
            <Link
              key={index}
              href={link.to}
              className="font-semibold text-white text-base leading-normal transition-all duration-300 hover:translate-x-2 hover:opacity-90"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Contact Info */}
        <address className="flex flex-col w-full sm:w-[280px] items-start justify-center gap-3.5 not-italic">
          <h3 className="font-bold text-white text-xl md:text-2xl leading-normal">
            Contact Us
          </h3>

          <Link
            href={`mailto:${project?.email ?? "#"}`}
            className="font-semibold text-white text-base leading-normal transition-all duration-300 hover:translate-x-2 hover:opacity-90"
          >
            {project?.email}
          </Link>

          <Link
            href={`tel:${project?.mobile_no ?? "#"}`}
            className="font-semibold text-white text-base leading-normal transition-all duration-300 hover:translate-x-2 hover:opacity-90"
          >
            {project?.mobile_no}, {project?.office_no}
            {/**+91-99292 16908, +91-70148 51877 */}
          </Link>

          <p className="font-semibold text-white text-base leading-[25px]">
            {project?.address1}
          </p>
        </address>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 px-4 md:px-[104px] py-4 w-full bg-[#9b2625] text-center sm:text-left">
        <p className="font-normal text-white text-sm md:text-lg leading-normal">
          © {new Date().getFullYear()}  {project?.company_name || "Jaipur Food Caterers"}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};