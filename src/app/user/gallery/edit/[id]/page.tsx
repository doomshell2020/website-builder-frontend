"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { editGallerySchema } from "@/schemas/gallery.schema";
import { updateGallery, getGalleryById } from "@/services/gallery.service";

type FormData = z.infer<typeof editGallerySchema>;

export default function EditGallery() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(editGallerySchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      images: [],
      status: "",
    },
  });

  const handleBack = () => { router.push("/user/gallery"); };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await getGalleryById(id);
        const data = (res as any).result || res;

        setValue("title", data?.title || "");
        setValue("slug", data?.slug || "");
        setValue("description", data?.description || "");
        // handle images: data.images may be array or string
        let imgs: string[] = [];
        if (data?.images) {
          if (Array.isArray(data.images)) {
            imgs = data.images.map((p: string) =>
              p.startsWith("http") ? p : `${process.env.NEXT_PUBLIC_IMAGE_URL}${p}`
            );
          } else if (typeof data.images === "string" && data.images.length > 0) {
            // single string (maybe comma separated or single path) — handle common cases
            try {
              const parsed = JSON.parse(data.images);
              if (Array.isArray(parsed)) {
                imgs = parsed.map((p: string) => (p.startsWith("http") ? p : `${process.env.NEXT_PUBLIC_IMAGE_URL}${p}`));
              } else {
                imgs = [(data.images.startsWith("http") ? data.images : `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.images}`)];
              }
            } catch {
              // fallback: single string
              imgs = [(data.images.startsWith("http") ? data.images : `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.images}`)];
            }
          }
        }

        setExistingImages(imgs);
        // set combined previews
        setImagePreviews([...imgs]);
      } catch (error) {
        SwalError({ title: "Error", message: "Failed to load Gallery data." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  // Auto-slug generation from title
  const titleValue = watch("title");
  useEffect(() => {
    if (titleValue) {
      const slug = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Set slug and trigger validation
      setValue("slug", slug, { shouldValidate: true, shouldDirty: true });
    }
  }, [titleValue, setValue]);

  // Whenever existingImages or imageFiles change, recompute previews and also update form value "images" (new files)
  useEffect(() => {
    const filePreviews = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews([...existingImages, ...filePreviews]);

    // set "images" field to new files array so zod can validate new files if needed
    setValue("images", imageFiles as any, { shouldValidate: true });
    // cleanup object URLs on unmount or when files change
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [existingImages, imageFiles, setValue]);

  // Helper: total image count (existing + new)
  const totalImageCount = existingImages.length + imageFiles.length;

  const onSubmit = async (data: any) => {
    try {
      // Ensure at least one image remains (existing or new)
      if (totalImageCount === 0) {
        SwalError({ title: "Failed!", message: "Please upload at least one image." });
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("slug", data.slug || "");
      formData.append("description", data.description || "");

      if (existingImages.length > 0) {
        // Extract only filenames from URLs like "/uploads/gallery/image1.jpg"
        const existingFilenames = existingImages.map((url: string) => {
          const parts = url.split("/");
          return parts[parts.length - 1]; // get last segment (the filename)
        });

        formData.append("existingImages", JSON.stringify(existingFilenames));
      } else {
        formData.append("existingImages", JSON.stringify([]));
      }

      // Append new files
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file: File) => {
          formData.append("images", file);
        });
      }

      // FormData Console
      for (const [key, value] of formData.entries()) {
        console.log("FormData: ", key, value);
      }

      const response: any = await updateGallery(id, formData);

      if (response?.status === true) {
        SwalSuccess("Gallery has been updated successfully.");
        router.push("/user/gallery");
      } else {
        SwalError({ title: "Failed!", message: response?.message || "Failed to update gallery." });
      }
    } catch (error: any) {
      let message = "Something went wrong.";
      if (typeof error === "object" && error !== null && "response" in error) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      SwalError({ title: "Error!", message });
    }
  };

  // File input change: add new files while respecting total max of 20
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);

    // Validate types
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const invalid = incoming.find((f) => !allowedTypes.includes(f.type));
    if (invalid) {
      SwalError({ title: "Failed!", message: "Only JPG, JPEG, and PNG files are allowed." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate combined count
    if (totalImageCount + incoming.length > 20) {
      SwalError({ title: "Failed!", message: "You can upload a maximum of 20 images only. Please select fewer images." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Append new files to state
    const newFiles = [...imageFiles, ...incoming];
    setImageFiles(newFiles);

    // Clear the native input so selecting same file again still triggers change if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove function: detect whether removed index belongs to existingImages or new imageFiles
  const handleRemoveAtIndex = (index: number) => {
    if (index < existingImages.length) {
      // remove an existing image
      const updatedExisting = [...existingImages];
      updatedExisting.splice(index, 1);
      setExistingImages(updatedExisting);
      // React will update previews via effect
    } else {
      // remove a new file (index shifted by existingImages.length)
      const newIndex = index - existingImages.length;
      const updatedFiles = [...imageFiles];
      updatedFiles.splice(newIndex, 1);
      setImageFiles(updatedFiles);

      // Update the file input.files using DataTransfer so native input shows current selection if reopened
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach((file) => dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;
      }
    }
    // Also update the RHF value for images (done automatically by effect that watches imageFiles)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <h1 className="text-xl font-medium text-gray-800 ml-2">Edit Gallery</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter Title"
                  onKeyDown={(e) => {
                    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
                    if (allowedKeys.includes(e.key)) return;
                    if (!/^[A-Za-z\-\{\} ]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasted = e.clipboardData.getData("text");
                    const filtered = pasted.replace(/[^A-Za-z\-\{\} ]/g, "");
                    document.execCommand("insertText", false, filtered);
                  }}
                />
                {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">
                  Slug <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="slug"
                  value={watch("slug")}
                  {...register("slug")}
                  placeholder="Enter Slug"
                  onChange={(e) => setValue("slug", e.target.value, { shouldValidate: true })}
                  onKeyDown={(e) => {
                    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
                    if (allowedKeys.includes(e.key)) return;
                    if (e.key === " ") {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const { selectionStart, selectionEnd, value } = input;
                      if (selectionStart !== null && selectionEnd !== null) {
                        const before = value.slice(0, selectionStart);
                        const after = value.slice(selectionEnd);
                        const newValue = (before + "-" + after).replace(/-+/g, "-");
                        input.value = newValue;
                        const pos = before.length + 1;
                        input.setSelectionRange(pos, pos);
                        setValue("slug", newValue, { shouldValidate: true });
                      }
                      return;
                    }
                    if (e.key === "-") {
                      const input = e.currentTarget;
                      const { selectionStart, value } = input;
                      if (selectionStart !== null) {
                        const before = value[selectionStart - 1];
                        const after = value[selectionStart];
                        if (before === "-" || after === "-") {
                          e.preventDefault();
                          return;
                        }
                      }
                    }
                    if (!/^[a-z\-\\]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasted = e.clipboardData.getData("text");
                    let filtered = pasted.replace(/[^a-z\-\\ ]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
                    document.execCommand("insertText", false, filtered);
                    setValue("slug", filtered, { shouldValidate: true });
                  }}
                />
                {errors.slug && <p className="text-red-600 text-sm">{errors.slug.message}</p>}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">
                  Description <span className="text-red-600">*</span>
                </Label>
                <Textarea id="description" placeholder="Enter Description" {...register("description")} className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Images */}
              <div>
                <Label htmlFor="images">Upload Images</Label>
                <Input
                  ref={fileInputRef}
                  id="images"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload up to 20 images (JPG, JPEG, PNG only). Current: {totalImageCount} / 20
                </p>
                {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images.message}</p>}
              </div>

              {/* Image Previews (span full width) */}
              <div className="md:col-span-2 border border-gray-300 rounded-md p-4 flex flex-col gap-2 items-start mt-4">
                <Label htmlFor="images" className="text-medium font-semibold">
                  Uploaded Images:
                </Label>
                <div className="flex gap-2 mt-2 flex-wrap min-h-32">
                  {imagePreviews.length > 0 ? (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {imagePreviews.map((url, index) => {
                        // if index < existingImages.length then this preview is an existing image
                        const isExisting = index < existingImages.length;
                        const file = isExisting ? undefined : imageFiles[index - existingImages.length];

                        return (
                          <div key={index} className="w-32 h-32 relative border rounded overflow-hidden bg-gray-50">
                            {/* Remove button */}
                            <Button
                              type="button"
                              onClick={() => handleRemoveAtIndex(index)}
                              className="absolute top-1 right-1 h-8 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-full p-2 shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                              aria-label={`Remove image ${index + 1}`}
                            >
                              <Trash2 size={16} className="text-white" />
                            </Button>

                            {/* Image preview (existing URL or object URL) */}
                            <img src={url} alt={file?.name || `Image ${index + 1}`} className="object-cover w-full h-full rounded" />
                            {/* small badge to indicate existing vs new */}
                            <div className="absolute left-1 bottom-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                              {isExisting ? "Saved" : "New"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="items-center gap-4 min-h-32 flex justify-center text-gray-400 text-sm italic">No images uploaded yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex justify-between">
              <Button type="button" className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-[5px]" onClick={handleBack}>
                Back
              </Button>

              <Button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 rounded-[5px] text-white px-6 py-2 min-w-[110px] flex items-center justify-center disabled:opacity-60">
                {isSubmitting ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};