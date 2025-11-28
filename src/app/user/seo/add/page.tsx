"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createSeo } from "@/services/seo.service";
import { Textarea } from "@/components/ui/textarea";
import { seoZodSchema } from "@/schemas/seo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

type FormData = z.infer<typeof seoZodSchema>;
export default function AddSeoForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(seoZodSchema),
  });

  const handleBack = () => { router.back(); };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        orgid: data.orgid ?? 0,
        page: data.page,
        location: data.location,
        title: data.title,
        keyword: data.keyword,
        description: data.description,
        status: data.status || "Y",
      };

      const response: any = await createSeo(payload);

      if (response?.status === true) {
        SwalSuccess("Seo has been saved successfully.");
        router.push("/user/seo");
      } else {
        SwalError({
          title: "Failed!",
          message: response?.message || "Failed to create Seo.",
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
            <h1 className="text-xl font-medium text-gray-800 ml-2">Add SEO</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

            {/* page */}
            <div>
              <Label htmlFor="page">Page <span className="text-red-600">*</span></Label>
              <Input
                id="page"
                {...register("page")}
                placeholder="Enter page name"
              />
              {errors.page && (
                <p className="text-red-600 text-sm">{errors.page.message}</p>
              )}
            </div>

            {/* location */}
            <div className="">
              <Label htmlFor="location">
                Page Location <span className="text-red-600">*</span>
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Enter page location"
              />
              {errors.location && (
                <p className="text-red-600 text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* title */}
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input id="title" {...register("title")} placeholder="Enter Title" />

              {errors.title && (
                <p className="text-red-600 text-sm">
                  {errors.title.message as string}
                </p>
              )}
            </div>

            <div></div>

            {/* keyword */}
            <div>
              <Label htmlFor="keyword">
                Keyword <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="keyword"
                placeholder="Enter Keyword"
                {...register("keyword")}
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.keyword && (<p className="text-red-600 text-sm mt-1">{errors.keyword.message}</p>)}
            </div>

            {/* description */}
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
