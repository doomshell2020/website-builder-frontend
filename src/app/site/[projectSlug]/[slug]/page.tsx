import NotFoundPage from "@/app/not-found";
import { fetchProject } from "@/services/userService";
import StaticPageFallback from "@/components/StaticPageFallback";

export default async function ThemeRouter({
  params,
}: { params: Promise<{ projectSlug: string; slug?: string[] }>; }) {
  const { projectSlug, slug } = await params;
  console.log("slug: ", slug);

  const pageName = (Array.isArray(slug) ? slug.join("/") : slug) || "home";
  const project = await fetchProject(projectSlug);
  if (!project?.status) return <NotFoundPage />;

  const ProjectDetail = project.result;
  const themeName =
    project?.result?.Theme?.name?.toLowerCase().replace(/\s+/g, "-") ?? "default";

  // console.log("ProjectDetail: ", ProjectDetail);
  // console.log("themeName: ", themeName);

  try {
    // ✅ Load Layout and Page dynamically
    const ThemeLayout = (await import(`@/app/themes/${themeName}/layout`)).default;

    let ThemePage: any;

    try {
      ThemePage = (await import(`@/app/themes/${themeName}/${pageName}/page`)).default;
    } catch (pageErr) {

      console.warn(`Page '${pageName}' not found for theme '${themeName}', using StaticPage fallback.`);

      ThemePage = () => <StaticPageFallback company={project?.result?.company_name} slug={pageName} />;
    }

    return (
      <ThemeLayout project={ProjectDetail}>
        <ThemePage project={ProjectDetail} />
      </ThemeLayout>
    );
  } catch (err) {
    console.error("Theme or layout not found:", err);
    return <NotFoundPage />;
  }
}
