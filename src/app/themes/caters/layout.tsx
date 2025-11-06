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
      <Footer project={project} />
      <Testimonials project={project} />
    </div>
  );
};

// // app/themes/caters/layout.tsx
// import "./caters.css";
// import Header from "./components/header/page";
// import Footer from "./components/footer/page";
// import Testimonials from "./testimonials/page";
// import { User } from "@/types/user";

// async function getProject(): Promise<User> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project`, {
//     cache: "no-store", // or "force-cache" depending on your needs
//   });
//   if (!res.ok) throw new Error("Failed to fetch project");
//   return res.json();
// }

// export default async function Layout({ children }: { children: React.ReactNode }) {
//   const project = await getProject(); // ✅ dynamic data fetched here

//   return (
//     <div className="min-h-screen flex flex-col" id="caters-theme">
//       <Header project={project} />
//       <main className="flex-1">{children}</main>
//       <Testimonials project={project} />
//       <Footer project={project} />
//     </div>
//   );
// };