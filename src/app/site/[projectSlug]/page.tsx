import NotFoundPage from "@/app/not-found";
import { fetchProject } from "@/services/userService";

export default async function ProjectEntry({ params }) {
  const { projectSlug } = await params;
  const project = await fetchProject(projectSlug);

  if (!project?.status) return <NotFoundPage />;

  const ProjectDetail = project.result;
  const themeName =
    project.result?.Theme?.name?.toLowerCase().replace(/\s+/g, "-") ?? "default";

  let ThemeLayout, ThemeHome;

  try {
    // Try to import the theme dynamically
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