// site/[projectSlug]/[slug]/page.tsx
import NotFoundPage from "@/app/not-found";
import { fetchProject } from "@/services/userService";
import StaticPageFallback from "@/components/StaticPageFallback";

export default async function ThemeRouter({
  params,
}: {
  params: Promise<{ projectSlug: string; slug?: string[] }>;
}) {
  const { projectSlug, slug } = await params;

  const pageName = (Array.isArray(slug) ? slug.join("/") : slug) || "home";

  // 1️⃣ Fetch project
  const project = await fetchProject(projectSlug);
  if (!project?.status) return <NotFoundPage />;

  const ProjectDetail = project.result;
  const themeName =
    ProjectDetail?.Theme?.slug?.trim()
      ? ProjectDetail.Theme.slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      : "default";

  try {
    // 2️⃣ Load Layout + Theme Page
    const ThemeLayout = (await import(`@/app/themes/${themeName}/layout`)).default;

    let ThemePage;
    try {
      ThemePage = (await import(`@/app/themes/${themeName}/${pageName}/page`)).default;
    } catch (pageErr) {
      console.warn(
        `⚠️ Page '${pageName}' not found in theme '${themeName}', using fallback.`
      );
      ThemePage = () => (
        <StaticPageFallback company={ProjectDetail.company_name} slug={pageName} />
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
