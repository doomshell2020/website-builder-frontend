'use client';
import React, { useEffect, useState } from 'react';
import { getLogo } from "@/lib/auth";

const Logo = ({ className = "" }: { className?: string }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedLogo = getLogo();
    setLogo(storedLogo || "");
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Skeleton loader */}
        <div className="w-20 h-10 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center">
        <img
          src={
            logo
              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${logo}`
              : "/assest/image/defaultUser.webp"
          }
          alt="Company Logo"
          className="min-h-8 max-h-16 object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
