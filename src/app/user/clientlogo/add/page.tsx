"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { ClientLogoSchema } from "@/schemas/clientlogo.schema";
import { createClientLogo } from "@/services/clientlogo.service";
type FormData = z.infer<typeof ClientLogoSchema>;

export default function AddClientLogoForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePath, setImagePath] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(ClientLogoSchema) as any,
  });

  const handleBack = () => {
    router.push("/user/clientlogo");
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("seq", String(data.seq));
      formData.append("url", data.url);
      formData.append("image", imagePath);

      const response: any = await createClientLogo(formData);

      if (response?.status === true) {
        SwalSuccess("Client logo has been saved successfully.");
        router.push("/user/clientlogo");
      } else {
        SwalError({
          title: "Failed!",
          message: response?.message || "Failed to create Client logo.",
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
            {/* <Button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </Button> */}
            <h1 className="text-xl font-medium text-gray-800 ml-2">
              Add Client Logo
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

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
              <Input id="url" {...register("url")} placeholder="Enter Website Url" />
              {errors.url && (
                <p className="text-red-600 text-sm">{errors.url.message}</p>
              )}
            </div>

            {/* Image */}
            <div>
              <Label htmlFor="image">
                Banner Image <span className="text-red-600">*</span>{" "}
                <p className="inline text-xs text-gray-500 mt-1">
                  Upload only (.jpg, .jpeg, and .png)
                </p>
              </Label>
              <Input
                ref={fileInputRef}
                id="images"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) {
                    setValue("image", null, { shouldValidate: true });
                    setImagePath(null);
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
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                    return;
                  }

                  setValue("image", file, { shouldValidate: true });
                  setImagePath(file);
                }}
              />

              {errors.image && (
                <p className="text-red-600 text-sm">
                  {errors.image.message as string}
                </p>
              )}
            </div>

            <div></div>
            
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
}
