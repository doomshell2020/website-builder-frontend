"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import slugify from "slugify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { themeSchema } from "@/schemas/theme.schema";
import { createWebsiteType } from "@/services/theme.service";
import { WebsiteTypeAttribute } from '@/types/theme'
type FormData = z.infer<typeof themeSchema>;

export default function WebsiteTypeAddForm() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(themeSchema),
  });

  const handleBack = () => {
    router.push("/admin/theme");
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;

    // Step 1: Generate slug
    let newSlug = slugify(name, { lower: true, strict: true });

    // Step 2: Replace & with "and" manually
    newSlug = newSlug.replace(/&/g, "and");

    setSlug(newSlug);
    setValue("slug", newSlug); // update react-hook-form value
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload: WebsiteTypeAttribute = {
        name: data.name,
        slug: data.slug,
        description: data.description,
      };
      const response: any = await createWebsiteType(payload);
      if (response?.status === true) { SwalSuccess("Theme added successfully."); handleBack(); }
      else { SwalError({ title: "Failed!", message: response?.message ?? "Failed to connect.", }); }
    } catch (error: any) {
      let message = "Something went wrong.";
      if (typeof error === "object" && error !== null && "response" in error) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      SwalError({ title: "Error!", message, });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <h1 className="text-xl font-medium text-gray-800 ml-2">Add Theme</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md" >

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

            {/* Type Name */}
            <div className="flex flex-col">
              <Label htmlFor="name" className="mb-1 font-medium">Theme Name <span className="text-red-600">*</span></Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                onChange={onNameChange}
                placeholder="Enter Theme"
              />
              {errors.name && <p className="text-red-600">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <div className="flex flex-col">
              <Label htmlFor="slug" className="mb-1 font-medium">Slug</Label>
              <Input
                id="slug"
                {...register("slug", { required: "Slug is required" })}
                placeholder="Enter Slug"
                value={slug}
                onChange={(e) => {
                  const val = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/&/g, "and")
                    .replace(/[^a-z0-9-]/g, "");
                  setSlug(val);
                  setValue("slug", val);
                }}
              />
              {errors.slug && (
                <p className="text-red-600 text-sm">{errors.slug.message as string}</p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <Label htmlFor="description" className="mb-1 font-medium"> Description</Label>
              <Textarea
                id="description"
                placeholder="Enter Description"
                {...register("description")}
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
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
      </main>

    </div>
  );
};