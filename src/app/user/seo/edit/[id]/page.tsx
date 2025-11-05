"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Loader from '@/components/ui/loader'
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { seoZodSchema } from "@/schemas/seo.schema";
import { updateSeo, getSeoById } from "@/services/seo.service";
import dynamic from "next/dynamic";

const SummernoteEditor = dynamic(() => import("@/components/ui/SummernoteEditor"), {
  ssr: false,
});
type FormData = z.infer<typeof seoZodSchema>;

export default function EditSeoForm() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const [description, setDescription] = useState<string | null>();
  const [keyword, setKeyword] = useState<string | null>();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(seoZodSchema),
  });

  const handleBack = () => {
    router.push("/user/seo");
  };

  const descriptionValue = watch("description") ?? "N/A";
  const keywordValue = watch("keyword") ?? "N/A";

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await getSeoById(id);
        const data = (res as any)?.result || res;
        setValue("title", data.title || "");
        setValue("page", data.page || "");
        setValue("location", data.location || "");
        setValue("description", data.description || "");
        setValue("keyword", data.keyword || "");
      } catch (error) {
        SwalError({ title: "Error", message: "Failed to load this SEO data." });
        handleBack();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        page: data.page,
        location: data.location,
        title: data.title,
        keyword: data.keyword,
        description: data.description,
        status: data.status || "Y",
      };

      const response: any = await updateSeo(id, payload);

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
            {/* <Button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </Button> */}
            <h1 className="text-xl font-medium text-gray-800 ml-2">Edit SEO</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (<Loader />) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6 bg-white rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
              {/* page */}
              <div>
                <Label htmlFor="page">
                  Page <span className="text-red-600">*</span>
                </Label>
                <Input id="page" {...register("page")} placeholder="Enter page name" />
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
              <div className="">
                <Label htmlFor="keyword">
                  Keyword <span className="text-red-600">*</span>
                </Label>
                <SummernoteEditor
                  value={keywordValue}
                  onChange={(html) => {
                    setKeyword(html);
                    setValue("keyword", html, { shouldValidate: true });
                  }}
                  placeholder="Enter Keyword here...."
                />
                {errors.keyword && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.keyword.message}
                  </p>
                )}
              </div>
              {/* description */}
              <div className="">
                <Label htmlFor="description">
                  Description <span className="text-red-600">*</span>
                </Label>
                <SummernoteEditor
                  value={descriptionValue}
                  onChange={(html) => {
                    setDescription(html);
                    setValue("description", html, { shouldValidate: true });
                  }}
                  placeholder="Enter Description here...."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description.message}
                  </p>
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
}
