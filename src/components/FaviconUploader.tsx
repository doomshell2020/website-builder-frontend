"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { SwalError } from "@/components/ui/SwalAlert";

interface FaviconUploadProps {
  onFileSelect: (file: File | null) => void;
  defaultFavicon?: string | null;
}

export default function FaviconUpload({
  onFileSelect,
  defaultFavicon = null,
}: FaviconUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultFavicon);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate only .ico below 200 KB
  const validateFile = (file: File) => {
    const maxSize = 200 * 1024; // 200 KB

    if (file.type !== "image/x-icon" && !file.name.endsWith(".ico")) {
      SwalError({
        title: "Invalid File",
        message: "Only favicon .ico file is allowed.",
      });
      return false;
    }

    if (file.size > maxSize) {
      SwalError({
        title: "File Too Large",
        message: "Please upload a favicon smaller than 200 KB.",
      });
      return false;
    }
    return true;
  };

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className="w-24 h-24 border border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:border-blue-400 transition-all"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Favicon"
            width={96}
            height={96}
            className="object-contain w-12 h-12"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500 text-center">
            <Upload className="w-6 h-6 mb-1 text-gray-400" />
            <p className="text-[11px]">Upload Favicon</p>
            <span className="text-[10px] text-gray-400">(.ico only)</span>
          </div>
        )}
      </div>

      {/* File Input Hidden */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".ico"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
