// site/[projectSlug]/page.tsx
import NotFoundPage from "@/app/not-found";
import type { Metadata } from "next";
import { cache } from "react";
import { fetchProject } from "@/services/userService";


// 1️⃣ Cached fetch — runs only once per request
const getCachedProject = cache(async (projectSlug: string) => {
  return await fetchProject(projectSlug);
});


// ---------------------- 🔥 Dynamic Metadata & Favicon ----------------------
export async function generateMetadata(
  { params }: { params: { projectSlug: string } }
): Promise<Metadata> {
  const { projectSlug } = await params;

  const project = await getCachedProject(projectSlug); // <— no 2nd API call
  if (!project?.status) return { title: "Not Found" };

  const p = project.result;

  return {
    title: p?.company_name || "Project",
    description: p?.seo_description || p?.company_name,
    icons: {
      icon: p?.favicon
        ? [{ url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${p.favicon}` }]
        : [{ url: "/favicon.ico" }],
      apple: p?.favicon
        ? [{ url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${p.favicon}` }]
        : undefined,
    },
    openGraph: {
      title: p?.company_name,
      description: p?.seo_description,
      siteName: p?.company_name,
      type: "website",
      images: p?.og_image ? [p.company_logo] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: p?.company_name,
      description: p?.seo_description,
      images: p?.og_image ? [p?.og_image] : [],
    },
  };
}


// ---------------------- ⚡ Dynamic Themed Page Rendering ----------------------
export default async function ProjectEntry({
  params,
}: {
  params: { projectSlug: string };
}) {
  const { projectSlug } = await params;

  const project = await getCachedProject(projectSlug); // ❗ reuses cached request
  if (!project?.status) return <NotFoundPage />;

  const ProjectDetail = project.result;

  const themeName =
    ProjectDetail?.Theme?.slug?.trim()
      ? ProjectDetail.Theme.slug.trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
      : "default";

  let ThemeLayout, ThemeHome;

  try {
    const layoutModule = await import(`@/app/themes/${themeName}/layout`);
    const homeModule = await import(`@/app/themes/${themeName}/home/page`);
    ThemeLayout = layoutModule.default;
    ThemeHome = homeModule.default;
  } catch {
    console.warn(`⚠️ Theme "${themeName}" not found — using default theme.`);
    const layoutModule = await import("@/app/themes/default/layout");
    const homeModule = await import("@/app/themes/default/home/page");
    ThemeLayout = layoutModule.default;
    ThemeHome = homeModule.default;
  }

  return (
    <ThemeLayout project={ProjectDetail}>
      <ThemeHome project={ProjectDetail} />
    </ThemeLayout>
  );
}



// Without metadata and with old param handling
{/** import NotFoundPage from "@/app/not-found";
import { fetchProject } from "@/services/userService";
export default async function ProjectEntry({ params }: { params: { projectSlug: string } }) {
  const { projectSlug } = await params;
  // 1️⃣ Fetch project data (by slug or domain)
  const project = await fetchProject(projectSlug);
  if (!project?.status) return <NotFoundPage />;
  const ProjectDetail = project.result;
  // 2️⃣ Resolve theme name safely
  const themeName =
    ProjectDetail?.Theme?.slug?.trim()
      ? ProjectDetail.Theme.slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      : "default";
  let ThemeLayout, ThemeHome;
  try {
    // 3️⃣ Try importing the project’s theme
    const layoutModule = await import(`@/app/themes/${themeName}/layout`);
    const homeModule = await import(`@/app/themes/${themeName}/home/page`);
    ThemeLayout = layoutModule.default;
    ThemeHome = homeModule.default;
  } catch (error) {
    console.warn(`⚠️ Theme "${themeName}" not found, falling back to default.`);
    try {
      const layoutModule = await import("@/app/themes/default/layout");
      const homeModule = await import("@/app/themes/default/home/page");
      ThemeLayout = layoutModule.default;
      ThemeHome = homeModule.default;
    } catch (fallbackError) {
      console.error("❌ Default theme also missing:", fallbackError);
      return <NotFoundPage />;
    }  }
  return (
    <ThemeLayout project={ProjectDetail}>
      <ThemeHome project={ProjectDetail} />
    </ThemeLayout>
  );}
 */}