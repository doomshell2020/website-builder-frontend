// site/[projectSlug]/page.tsx
import NotFoundPage from "@/app/not-found";
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
    }
  }

  // 4️⃣ Render with proper theme
  return (
    <ThemeLayout project={ProjectDetail}>
      <ThemeHome project={ProjectDetail} />
    </ThemeLayout>
  );
}


// OLD CODE 
{/**
  import NotFoundPage from "@/app/not-found";
import { fetchProject } from "@/services/userService";

export default async function ProjectEntry({ params }) {
  const { projectSlug } = await params;
  const project = await fetchProject(projectSlug);

  if (!project?.status) return <NotFoundPage />;

  const ProjectDetail = project?.result;
  const themeName = project?.result?.Theme?.name?.toLowerCase().replace(/\s+/g, "-") ?? "default";

  try {
    const ThemeLayout = (await import(`@/app/themes/${themeName}/layout`)).default;
    const ThemeHome = (await import(`@/app/themes/${themeName}/home/page`)).default;

    return (
      <ThemeLayout project={ProjectDetail}>
        <ThemeHome project={ProjectDetail} />
      </ThemeLayout>
    );
  } catch (err) {
    console.error("Theme not found:", err);
    return <NotFoundPage />;
  }
};
  */}