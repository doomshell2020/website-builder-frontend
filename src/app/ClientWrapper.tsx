"use client";
import { useEffect, useState } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Trigger fade-in after the client mounts
    const timeout = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(timeout);
  }, []);

  return (
    <div
      style={{
        opacity: hydrated ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      {children}
    </div>
  );
};
