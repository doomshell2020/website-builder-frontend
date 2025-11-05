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
        <footer className="text-center py-6 border-t border-[#d9c9a7] mt-10">
            © {new Date().getFullYear()} {project?.company_name || "Golden Jewellers"}
        </footer>
    );
};