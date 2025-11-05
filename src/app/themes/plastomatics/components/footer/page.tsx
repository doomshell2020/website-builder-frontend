"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultProps {
    project?: User;
};

export default function Footer({ project }: DefaultProps) {
    const router = useRouter();
    return (
        <footer className="py-6 bg-gray-900 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} {project?.company_name ?? "Plastomatics"}. All Rights Reserved.
        </footer>


    );
};