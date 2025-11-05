"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { SwalError } from "@/components/ui/SwalAlert";
import ImageCropper from "@/components/ImageCropper"; // 👈 adjust this path if needed

interface ProfileImageUploadProps {
    onFileSelect: (file: File | null) => void;
    defaultImage?: string | null;
}

export default function ProfileImageUpload({
    onFileSelect,
    defaultImage = null,
}: ProfileImageUploadProps) {
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
        const maxSize = 2 * 1024 * 1024; // 2 MB

        if (!file) return;

        // ✅ Validate file type
        if (!validTypes.includes(file.type)) {
            SwalError({
                title: "Invalid File Type",
                message: "Only JPG, JPEG, PNG, GIF, TIFF, and WEBP images are allowed.",
            });

            // Reset file & preview states
            setRawFile(null);
            setRawPreview(null);
            setPreview(defaultImage || null);

            // Clear input
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        // ✅ Validate file size
        if (file.size > maxSize) {
            SwalError({
                title: "File Too Large",
                message: "Please upload an image smaller than 2 MB.",
            });

            // Reset preview
            setRawFile(null);
            setRawPreview(null);
            setPreview(defaultImage || null);

            // Clear input
            if (fileInputRef.current) fileInputRef.current.value = "";
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
            <div className="relative w-32 h-32">
                {/* Image Preview */}
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300">
                    {preview && preview.trim() !== "" ? (
                        <Image
                            src={preview}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                            No Profile
                        </div>
                    )}
                </div>


                {/* Edit Button */}
                <label
                    htmlFor="imageUpload"
                    className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full shadow-md cursor-pointer hover:bg-blue-700"
                >
                    <Pencil className="w-4 h-4 text-white" strokeWidth={2.5} />
                    <input
                        id="imageUpload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/tiff,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </div>
            {/* 
            <p className="text-xs text-gray-500 mt-2 mb-2 text-center">
                Upload only JPG, JPEG, PNG, GIF, TIFF, or WEBP.
            </p> */}

            {/* Cropper Modal */}
            {showCropper && rawPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Crop Your Profile Photo
                            </h2>
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
};
