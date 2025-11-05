"use client";

import dynamic from "next/dynamic";

// This is now a client component, so we can safely disable SSR
const StaticPage = dynamic(() => import("@/components/StaticContent"), { ssr: false, });

export default function StaticPageFallback({ slug, company }: { slug: string, company: string }) {
    return <StaticPage company={company} slug={slug} />;
};