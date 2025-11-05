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
        <footer className="text-center py-6 text-sm text-gray-500 border-t">
            © {new Date().getFullYear()} {project?.company_name || "Company"}. All rights reserved.
        </footer>
    );
};