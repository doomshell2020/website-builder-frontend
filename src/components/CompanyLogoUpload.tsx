"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { SwalError } from "@/components/ui/SwalAlert";
import ImageCropper from "@/components/ImageCropper";

interface CompanyImageUploadProps {
  onFileSelect: (file: File | null) => void;
  defaultImage?: string | null;
}

export default function CompanyImageUpload({
  onFileSelect,
  defaultImage = null,
}: CompanyImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage);
  const [rawPreview, setRawPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Validate image before upload
  const validateFile = (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!validTypes.includes(file.type)) {
      SwalError({
        title: "Invalid File Type",
        message: "Only JPG, JPEG or PNG images are allowed.",
      });
      return false;
    }

    if (file.size > maxSize) {
      SwalError({
        title: "File Too Large",
        message: "Please upload an image smaller than 1 MB.",
      });
      return false;
    }

    return true;
  };

  // ✅ File input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;
    loadFile(file);
  };

  // ✅ Drag & drop file
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      loadFile(file);
    }
  }, []);

  // ✅ Load selected image preview
  const loadFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setRawPreview(previewUrl);
    setShowCropper(true);
  };

  // ✅ Close cropper
  const handleCropperClose = () => {
    setShowCropper(false);
    setRawPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ Reset to default
  const resetFile = () => {
    setPreview(defaultImage || null);
    onFileSelect(null);
  };

  return (
    <>
      {/* Upload Box */}
      <div
        className={`relative w-full h-32 border-[1px] rounded-lg overflow-hidden 
          flex flex-col items-center justify-center cursor-pointer 
          shadow-sm transition-all 
          ${isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400"
          }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Company Logo"
            width={400}
            height={200}
            className="object-contain w-full h-full p-2"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 text-center">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm font-medium">
              Drag & drop or click to upload <br />
              <span className="text-gray-400 text-xs">(PNG / JPG / JPEG, max 1 MB)</span>
            </p>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Cropper Modal */}
      {showCropper && rawPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Crop Your Company Logo</h2>
              <button
                onClick={handleCropperClose}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <ImageCropper
              imageSrc={rawPreview}
              onCropped={(croppedFile, previewUrl) => {
                setPreview(previewUrl);
                onFileSelect(croppedFile);
                setShowCropper(false);
              }}
              onCancel={handleCropperClose}
            />
          </div>
        </div>
      )}
    </>
  );
}
