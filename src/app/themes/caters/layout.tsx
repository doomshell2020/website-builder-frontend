// layout.tsx
import "./caters.css";
import Header from "./components/header/page";
import Footer from "./components/footer/page";
import Testimonials from "./testimonials/page";

export default function Layout({ children, project, }: { children: React.ReactNode; project: any; }) {
  return (
    <div className="min-h-screen flex flex-col" id="caters-theme">
      <Header project={project} />
      <main className="flex-1">{children}</main>
      <Testimonials project={project} />
      <Footer project={project} />
    </div>
  );
};