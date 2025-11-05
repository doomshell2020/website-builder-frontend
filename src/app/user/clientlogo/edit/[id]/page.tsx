"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Loader from '@/components/ui/loader'
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { editClientLogoSchema } from "@/schemas/clientlogo.schema";
import { updateClientLogo, getClientLogoById, } from "@/services/clientlogo.service";
type FormData = z.infer<typeof editClientLogoSchema>;

export default function EditClientLogoForm() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePath, setImagePath] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(editClientLogoSchema) as any,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await getClientLogoById(id);
        const data = (res as any)?.result || res;
        setValue("seq", data.seq || "");
        if (data?.image != null && data.image !== "") { setValue("image", data.image || ""); }
        setValue("url", data.url || "");
        if (data.image) {
          setImagePreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.image}`);
        }
      } catch (error) {
        SwalError({
          title: "Error",
          message: "Failed to load Client logo data.",
        });
        handleBack();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  const handleBack = () => {
    router.push("/user/clientlogo");
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("seq", String(data.seq));
      formData.append("url", data.url);
      if (imagePath) { formData.append("image", imagePath); }

      const response: any = await updateClientLogo(id, formData);
      if (response?.status === true) {
        SwalSuccess("Client logo has been updated successfully.");
        router.push("/user/clientlogo");
      } else {
        SwalError({
          title: "Failed!",
          message: response?.message || "Failed to update Client logo.",
        });
      }
    } catch (error: any) {
      let message = "Something went wrong.";
      if (typeof error === "object" && error !== null && "response" in error) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      SwalError({
        title: "Error!",
        message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <h1 className="text-xl font-medium text-gray-800 ml-2">
              Edit Client Logo
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (<Loader />) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md" >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black ">
              {/* Seq */}
              <div>
                <Label htmlFor="seq">
                  Order <span className="text-red-600">*</span>
                </Label>
                <Input type="number" id="seq" {...register("seq")} placeholder="Enter Order" onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }} onInput={(e) => {
                  const input = e.currentTarget;
                  if (input.value.length > 10) {
                    input.value = input.value.slice(0, 10);
                  }
                }} />
                {errors.seq && (
                  <p className="text-red-600 text-sm">{errors.seq.message}</p>
                )}
              </div>
              {/* Website Url */}
              <div>
                <Label htmlFor="url">
                  Website Url <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="url"
                  {...register("url")}
                  placeholder="Enter Website Url"
                />
                {errors.url && (
                  <p className="text-red-600 text-sm">{errors.url.message}</p>
                )}
              </div>
              {/* Image */}
              <div>
                <div>
                  <Label htmlFor="image">
                    Banner Image <span className="text-red-600">*</span>{" "}
                    <p className="inline text-xs text-gray-500 mt-1">
                      Upload only (.jpg, .jpeg, and .png)
                    </p>
                  </Label>
                  <Input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) {
                        setValue("image", null, { shouldValidate: true });
                        setImagePath(null);
                        setImagePreview(null);
                        return;
                      }

                      const isValidType = [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                      ].includes(file.type);

                      if (!isValidType) {
                        SwalError({
                          title: "Invalid File",
                          message: "Only JPG, JPEG, and PNG files are allowed.",
                        });
                        setValue("image", null, { shouldValidate: true });
                        setImagePath(null);
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                        return;
                      }

                      setValue("image", file, { shouldValidate: true });
                      setImagePath(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </div>

                {errors.image && (
                  <p className="text-red-600 text-sm">
                    {errors.image.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="image">Banner Image ( selected )</Label>
                {imagePreview ? (
                  <div className="w-full h-36 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-36 border rounded-lg flex items-center justify-center text-gray-400 bg-gray-100">
                    No image selected
                  </div>
                )}
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
        )}
      </main>
    </div>
  );
};