'use client';
import React, { useEffect, useState } from 'react';
import { getLogo } from "@/lib/auth";

const Logo = ({ className = "" }: { className?: string }) => {
  const [logo, setLogo] = useState<string | undefined>();

  useEffect(() => {
    const storedLogo = getLogo();
    setLogo(storedLogo);
  }, []);

  if (!logo) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center">
          <img
            src="/assest/image/defaultUser.webp" // fallback
            alt="Default Logo"
            className="min-h-8 max-h-16 object-contain opacity-70"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center">
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${logo}`}
          alt="Company Logo"
          className="min-h-8 max-h-16 object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
