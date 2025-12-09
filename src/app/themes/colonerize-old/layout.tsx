// layout.tsx
import "./colonerize.css";
import Header from "./components/header/page";
import Footer from "./components/footer/page";

export default function Layout({ children, project, }: { children: React.ReactNode; project: any; }) {
  return (
    <div className="min-h-screen flex flex-col .colonerize-theme">
      <Header project={project} />
      <main className="flex-1">{children}</main>
      <Footer project={project} />
    </div>
  );
};