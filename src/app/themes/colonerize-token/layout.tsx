// layout.tsx
import "@/styles/themes/colonerize/colonerize.css";
import Header from "./components/header/page";
import Footer from "./components/footer/page";
import { log } from "node:console";

export default function Layout({ children, project, }: { children: React.ReactNode; project: any; }) {

  const themeClass = `${project?.Theme.slug}-theme`;
  // log("Applied Theme Class:", themeClass);
  return (
    <div className={`min-h-screen flex flex-col ${themeClass} colonerize-theme`}>
      <Header project={project} />
      <main className="flex-1">{children}</main>
      <Footer project={project} />
    </div>
  );
};