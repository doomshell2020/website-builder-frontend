import NotFoundPage from "@/app/not-found";
import { fetchProject } from "@/services/userService";

export default async function ProjectEntry({ params }) {
  const { projectSlug } = await params;
  const project = await fetchProject(projectSlug);

  if (!project?.status) return <NotFoundPage />;

  const ProjectDetail = project?.result;
  const themeName = project?.result?.Theme?.name?.toLowerCase().replace(/\s+/g, "-") || "default";

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