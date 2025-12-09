// layout.tsx
import "./housing.css";
import Header from "./components/header/page";
import Footer from "./components/footer/page";

export default function HousingLayout({ children, project, }: { children: React.ReactNode; project: any; }) {
  return (
    <div className="min-h-screen flex flex-col housing-theme">
      <Header project={project} />
      <main className="flex-1">{children}</main>
      <Footer project={project} />
    </div>
  );
};