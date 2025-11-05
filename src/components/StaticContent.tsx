import { useEffect, useState } from "react";
import { findStaticByTitle } from "@/services/static.service";
import Loading from "@/components/ui/loader";
import NotFoundPage from "@/app/not-found";

export default function StaticPage({ slug, company }: { slug: string, company: string }) {
  const [loading, setLoading] = useState(true);
  const [isContent, setIsContent] = useState("");
  const [notFoundPage, setNotFoundPage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await findStaticByTitle(company, slug);
        if (res?.result?.content) {
          setIsContent(res.result.content);
        } else {
          setNotFoundPage(true);
        }
      } catch (error) {
        setNotFoundPage(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[900px] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (notFoundPage) {
    return <div className="mt-16">
      <NotFoundPage />
    </div>; // ✅ render custom 404
  }

  return (
    <div
      className="prose prose-sm max-w-full text-black"
      dangerouslySetInnerHTML={{ __html: isContent }}
    />
  );
};