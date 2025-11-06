"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { SwalError } from "@/components/ui/SwalAlert";
import ImageCropper from "@/components/ImageCropper"; // adjust path if needed

interface ImageUploadProps {
    onFileSelect: (file: File | null) => void;
    defaultImage?: string | null;
}

export default function ImageUpload({
    onFileSelect,
    defaultImage = null,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultImage);
    const [rawPreview, setRawPreview] = useState<string | null>(null);
    const [rawFile, setRawFile] = useState<File | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/tiff",
            "image/webp",
        ];
        const maxSize = 1 * 1024 * 1024; // 2 MB

        if (!validTypes.includes(file.type)) {
            SwalError({
                title: "Invalid File Type",
                message: "Only JPG, JPEG, PNG, GIF, TIFF, and WEBP images are allowed.",
            });
            e.target.value = "";
            return;
        }

        if (file.size > maxSize) {
            SwalError({
                title: "File Too Large",
                message: "Please upload an image smaller than 2 MB.",
            });
            e.target.value = "";
            return;
        }

        // ✅ Valid image, show cropper
        const previewUrl = URL.createObjectURL(file);
        setRawFile(file);
        setRawPreview(previewUrl);
        setShowCropper(true);
    };

    const handleCropperClose = () => {
        setShowCropper(false);
        setRawFile(null);
        setRawPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <>
            {/* Simple Image Preview */}
            {/* {preview && (
                <div className="mb-2">
                    <Image
                        src={preview}
                        alt="Selected"
                        width={150}
                        height={150}
                        className="object-cover border rounded"
                    />
                </div>
            )} */}

            {/* File Input */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/tiff,image/webp"
                onChange={handleFileChange}
                className="border border-[#d1d5db] text-sm p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Cropper Modal */}
            {showCropper && rawPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Crop Company Logo</h2>
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
