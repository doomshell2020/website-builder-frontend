// site/[projectSlug]/[slug]/page.tsx
import NotFoundPage from "@/app/not-found";
import StaticPageFallback from "@/components/StaticPageFallback";
import type { Metadata } from "next";
import { cache } from "react";
import { fetchProject } from "@/services/userService";

// Cached single API request
const getCachedProject = cache(async (projectSlug: string) => {
  return await fetchProject(projectSlug);
});

// ---------------------- 🔥 Dynamic Metadata ----------------------
export async function generateMetadata(
  { params }: { params: { projectSlug: string; slug?: string[] } }
): Promise<Metadata> {
  const { projectSlug, slug } = await params;

  const project = await getCachedProject(projectSlug); // <— no second API call
  if (!project?.status) return { title: "Not Found" };

  const p = project.result;

  const currentPage = slug?.length ? slug.join(" / ") : "";
  const pageLabel = currentPage
    ? currentPage.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

  const title = pageLabel ? `${p.company_name} / ${pageLabel}` : p.company_name;

  return {
    title,
    description: p?.seo_description || `${p.company_name} ${pageLabel}`,
    icons: {
      icon: p?.favicon
        ? [{ url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${p.favicon}` }]
        : [{ url: "/favicon.ico" }],
    },
    openGraph: {
      title,
      description: p?.seo_description,
      siteName: p?.company_name,
      type: "website",
      images: p?.og_image ? [p.og_image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p?.seo_description,
      images: p?.og_image ? [p.og_image] : [],
    },
  };
}


// ---------------------- ⚡ Dynamic Theme Page ----------------------
export default async function ThemeRouter({
  params,
}: {
  params: Promise<{ projectSlug: string; slug?: string[] }>;
}) {
  const { projectSlug, slug } = await params;
  const pageName = (Array.isArray(slug) ? slug.join("/") : slug) || "home";

  // Single request here (cached)
  const project = await getCachedProject(projectSlug);
  if (!project?.status) return <NotFoundPage />;

  const ProjectDetail = project.result;

  const themeName =
    ProjectDetail?.Theme?.slug?.trim()
      ? ProjectDetail.Theme.slug.trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      : "default";

  try {
    const ThemeLayout = (await import(`@/app/themes/${themeName}/layout`)).default;

    let ThemePage;
    try {
      ThemePage = (await import(`@/app/themes/${themeName}/${pageName}/page`)).default;
    } catch {
      console.warn(
        `⚠️ Page '${pageName}' not found in theme '${themeName}', using fallback.`
      );
      ThemePage = () => (
        <StaticPageFallback company={ProjectDetail.schema_name} slug={pageName} />
      );
    }

    return (
      <ThemeLayout project={ProjectDetail}>
        <ThemePage project={ProjectDetail} />
      </ThemeLayout>
    );
  } catch (err) {
    console.error("❌ Theme or layout not found:", err);
    return <NotFoundPage />;
  }
}
