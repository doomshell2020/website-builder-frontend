"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { GallerySchema } from "@/schemas/gallery.schema";
import { createGallery } from "@/services/gallery.service";
type FormData = z.infer<typeof GallerySchema>;

export default function AddGallery() {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(GallerySchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const handleBack = () => { router.push("/user/gallery") };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file: File) => {
          formData.append("images", file); // 👈 same key name for multiple files
        });
      }

      const response: any = await createGallery(formData);

      if (response?.status === true) {
        SwalSuccess("Gallery has been saved successfully.");
        router.push("/user/gallery");
      } else {
        SwalError({
          title: "Failed!",
          message: response?.message || "Failed to create gallery.",
        });
      }
    } catch (error: any) {
      console.log("error: ", error);

      let message = "Something went wrong.";
      if (typeof error === "object" && error !== null && "response" in error) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      SwalError({ title: "Error!", message });
    }
  };

  const titleValue = watch("title");
  useEffect(() => {
    if (titleValue) {
      const slug = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // ✅ Set value + re-validate field
      setValue("slug", slug, { shouldValidate: true, shouldDirty: true });
    }
  }, [titleValue, setValue]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <h1 className="text-xl font-medium text-gray-800 ml-2">Add Gallery</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

            {/* Title */}
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input id="title" {...register("title")} placeholder="Enter Title"
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                    "Home",
                    "End",
                  ];

                  if (allowedKeys.includes(e.key)) return;

                  // Allow only A-Z, a-z, dash, {, }
                  if (!/^[A-Za-z\-\{\} ]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData("text");
                  const filtered = pasted.replace(/[^A-Za-z\-\{\} ]/g, ""); // remove invalid chars
                  document.execCommand("insertText", false, filtered);
                }} />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug">
                Slug <span className="text-red-600">*</span>
              </Label>
              <Input id="slug" value={watch("slug")} {...register("slug")} placeholder="Enter Slug"
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                    "Home",
                    "End",
                  ];
                  if (allowedKeys.includes(e.key)) return;
                  if (e.key === " ") {
                    e.preventDefault();

                    const input = e.currentTarget;
                    const { selectionStart, selectionEnd, value } = input;

                    if (selectionStart !== null && selectionEnd !== null) {
                      const before = value.slice(0, selectionStart);
                      const after = value.slice(selectionEnd);

                      // insert dash and collapse consecutive dashes
                      const newValue = (before + "-" + after).replace(/-+/g, "-");

                      input.value = newValue;

                      // move cursor
                      const pos = before.length + 1;
                      input.setSelectionRange(pos, pos);
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
                        e.preventDefault(); // block duplicate dashes
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
                  let filtered = pasted
                    .replace(/[^a-z\-\\ ]/g, "") // allow letters, {}, -, space
                    .replace(/\s+/g, "-")             // convert space(s) to single dash
                    .replace(/-+/g, "-");             // collapse multiple dashes
                  document.execCommand("insertText", false, filtered);
                }} />
              {errors.slug && (
                <p className="text-red-600 text-sm">{errors.slug.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">
                Description <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter Description"
                {...register("description")}
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (<p className="text-red-600 text-sm mt-1">{errors.description.message}</p>)}
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
                onChange={(e) => {
                  const files = e.target.files;

                  if (!files || files.length === 0) {
                    setValue("images", [], { shouldValidate: true });
                    setImageFiles([]);
                    setImagePreviews([]);
                    return;
                  }

                  // ✅ Max 20 image limit
                  if (files.length > 20) {
                    SwalError({
                      title: "Failed!",
                      message: "You can upload a maximum of 20 images only. Please upload again.",
                    });

                    setValue("images", [], { shouldValidate: true });
                    setImageFiles([]);
                    setImagePreviews([]);

                    if (fileInputRef.current) fileInputRef.current.value = "";
                    return;
                  }

                  // ✅ Validate JPG, JPEG, PNG only
                  const validImages = Array.from(files).filter((file) =>
                    ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
                  );

                  if (validImages.length !== files.length) {
                    SwalError({
                      title: "Failed!",
                      message: "Only JPG, JPEG, and PNG files are allowed.",
                    });

                    setValue("images", [], { shouldValidate: true });
                    setImageFiles([]);
                    setImagePreviews([]);

                    if (fileInputRef.current) fileInputRef.current.value = "";
                    return;
                  }

                  // ✅ Store and preview
                  setValue("images", validImages, { shouldValidate: true });
                  setImageFiles(validImages);

                  const previews = validImages.map((file) => URL.createObjectURL(file));
                  setImagePreviews(previews);
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload up to 20 images (JPG, JPEG, PNG only)
              </p>
              {errors.images && (<p className="text-red-600 text-sm mt-1">{errors.images.message}</p>)}
            </div>

            {/* 🖼️ Image Preview Section */}
            <div className="md:col-span-2 border border-gray-300 rounded-md p-4 flex flex-col gap-2 items-start mt-4">
              <Label htmlFor="images" className="text-medium font-semibold">
                Uploaded Images:
              </Label>
              <div className="flex gap-2 mt-2 flex-wrap min-h-32">
                {imagePreviews.length > 0 ? (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {imagePreviews.map((url, index) => {
                      const file = imageFiles[index];

                      return (
                        <div
                          key={index}
                          className="w-32 h-32 relative border rounded overflow-hidden bg-gray-50"
                        >
                          {/* ❌ Remove button */}
                          <Button
                            type="button"
                            onClick={() => {
                              const updatedPreviews = [...imagePreviews];
                              const updatedFiles = [...imageFiles];
                              updatedPreviews.splice(index, 1);
                              updatedFiles.splice(index, 1);

                              setImagePreviews(updatedPreviews);
                              setImageFiles(updatedFiles);
                              setValue("images", updatedFiles, { shouldValidate: true });

                              // ✅ Instantly refresh <input>
                              if (fileInputRef.current) {
                                const dataTransfer = new DataTransfer();
                                updatedFiles.forEach((file) => dataTransfer.items.add(file));
                                fileInputRef.current.files = dataTransfer.files;
                              }
                            }}
                            className="absolute top-1 right-1 h-8 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-full p-2 shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                          >
                            <Trash2 size={16} className="text-white" />
                          </Button>

                          {/* 🖼️ Image preview */}
                          <img
                            src={url}
                            alt={file?.name || "Uploaded Image"}
                            className="object-cover w-full h-full rounded"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="items-center gap-4 min-h-32 flex justify-center text-gray-400 text-sm italic">
                    No images uploaded yet
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-between">
            <Button
              type="button"
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-[5px]"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 rounded-[5px] text-white px-6 py-2 min-w-[110px] flex items-center justify-center disabled:opacity-60 "
            >
              {isSubmitting ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Submit"
              )}
            </Button>
          </div>

        </form>
      </main>
    </div>
  );
};
