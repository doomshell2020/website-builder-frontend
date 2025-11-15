"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessagesSquare, Database, SlidersHorizontal, User, Cog, Palette, ClipboardPenLine,
  Search, Slack, GalleryHorizontalEnd, Quote, MessageCircleQuestion, ChevronDown, ScrollText,
} from "lucide-react";
import { getRole } from "@/lib/auth";

const Navigation = () => {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Detect click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Get active menu from path
  const getActiveMenuFromPath = useCallback((role: string, path: string) => {
    switch (role) {
      case "1": // Admin
        if (path.includes("/users")) return "users";
        if (path.includes("/schemas")) return "schemas";
        if (path.includes("/theme")) return "theme";
        if (path.includes("/plan")) return "plan";
        if (path.includes("/billings")) return "billings";
        return null;
      case "2": // User
        if (path.includes("/enquiry")) return "enquiry";
        if (path.includes("/faqs")) return "faq";
        if (path.includes("/seo")) return "seo";
        if (path.includes("/slider")) return "slider";
        if (path.includes("/static")) return "static";
        if (path.includes("/gallery")) return "gallery";
        if (path.includes("/testimonials")) return "testimonials";
        if (path.includes("/clientlogo")) return "clientlogo";
        return null;
      default:
        return null;
    }
  }, []);

  // ✅ Load role & active menu on route change
  useEffect(() => {
    const userRole = getRole();
    setRole(userRole);
    const menu = getActiveMenuFromPath(userRole, pathname);
    setActiveMenu(menu);
    setActiveDropdown(null);
  }, [pathname, getActiveMenuFromPath]);

  // ✅ Utility for styles
  const baseClasses = "flex items-center space-x-1 px-2 text-xs py-1 rounded-md transition-all";
  const getMenuClasses = (menu: string) =>
    `${baseClasses} ${activeMenu === menu
      ? "bg-blue-500 text-white !rounded-[8px]"
      : "text-blue-500 hover:underline"
    }`;

  // ✅ Toggle dropdown
  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  // ✅ Menu Items
  const menuItems = [
    {
      key: "enquiry",
      label: "Enquiry",
      href: "/user/enquiry",
      icon: <MessageCircleQuestion size={16} strokeWidth={3} />,
      visibleFor: ["2"],
    },
    {
      key: "faq",
      label: "FAQs",
      icon: <MessagesSquare size={16} strokeWidth={3} />,
      visibleFor: ["2"],
      isDropdown: true,
      children: [
        {
          key: "faq-categories",
          label: "FAQ Categories",
          href: "/user/faqs/categories",
        },
        {
          key: "faqs",
          label: "FAQs",
          href: "/user/faqs",
        },
      ],
    },
    {
      key: "seo",
      label: "SEO",
      href: "/user/seo",
      icon: <Search size={16} strokeWidth={3} />,
      visibleFor: ["2"],
    },
    {
      key: "static",
      label: "Static",
      href: "/user/static",
      icon: <Cog size={16} strokeWidth={2.5} />,
      visibleFor: ["2"],
    },
    {
      key: "slider",
      label: "Slider",
      href: "/user/slider",
      icon: <SlidersHorizontal size={16} strokeWidth={2.5} />,
      visibleFor: ["2"],
    },
    {
      key: "gallery",
      label: "Gallery",
      href: "/user/gallery",
      icon: <GalleryHorizontalEnd size={16} />,
      visibleFor: ["2"],
    },
    {
      key: "testimonials",
      label: "Testimonials",
      href: "/user/testimonials",
      icon: <Quote size={16} strokeWidth={2.5} />,
      visibleFor: ["2"],
    },
    {
      key: "clientlogo",
      label: "Client Logo",
      href: "/user/clientlogo",
      icon: <Slack size={16} />,
      visibleFor: ["2"],
    },
    {
      key: "users",
      label: "Users",
      href: "/admin/users",
      icon: <User size={16} strokeWidth={2.5} />,
      visibleFor: ["1"],
    },
    {
      key: "schemas",
      label: "Platform",
      href: "/admin/schemas",
      icon: <Database size={16} strokeWidth={2.5} />,
      visibleFor: ["1"],
    },
    {
      key: "theme",
      label: "Theme Store",
      href: "/admin/theme",
      icon: <Palette size={16} strokeWidth={2.5} />,
      visibleFor: ["1"],
    },
    {
      key: "plan",
      label: "Plans",
      href: "/admin/plan",
      icon: <ClipboardPenLine size={16} strokeWidth={2.5} />,
      visibleFor: ["1"],
    },
    {
      key: "billings",
      label: "Billings",
      href: "/admin/billings",
      icon: <ScrollText size={16} strokeWidth={2.5} />,
      visibleFor: ["1"],
    },
  ];

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="flex flex-wrap items-center p-4">
        <div
          className="flex flex-wrap items-center text-xs gap-2 relative"
          ref={dropdownRef}
        >
          {menuItems
            .filter((item) => item.visibleFor.includes(role || ""))
            .map((item) =>
              item.isDropdown ? (
                <div key={item.key} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className={`${getMenuClasses(item.key)} flex items-center gap-1`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronDown size={14} className="ml-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === item.key && (
                    <div className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          className={`block px-3 py-2 text-sm hover:bg-gray-100 ${pathname === child.href
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700"
                            }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={getMenuClasses(item.key)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;