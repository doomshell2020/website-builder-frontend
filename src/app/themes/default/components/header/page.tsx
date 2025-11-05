"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultProps {
    project?: User;
};

export default function Header({ project }: DefaultProps) {
    const router = useRouter();
    return (
        <header className="flex justify-between items-center px-10 py-6 border-b border-[#d9c9a7]">
            <h1 className="text-3xl font-serif tracking-wide uppercase"><Link
                href="/"
                onClick={(e) => { e.preventDefault(); router.push("/") }}
            > {project?.company_name || "Default"}</Link></h1>
            <nav className="space-x-6 text-lg">
                <Link
                    href="#about"
                    onClick={(e) => { e.preventDefault(); router.push("#about") }}
                > About </Link>
                <Link
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); router.push("#contact") }}
                > Contact </Link>
            </nav>
        </header>
    );
};