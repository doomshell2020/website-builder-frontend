"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from '@/components/ui/loader'
import { useRouter, useParams } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { TestimonialEditSchema } from "@/schemas/testimonial.schema";
import { updateTestimonial, getTestimonialById } from "@/services/testimonial.service";

type FormData = z.infer<typeof TestimonialEditSchema>;

export default function EditTestimonialForm() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagesPath, setImagesPath] = React.useState<File | null>(null);
  const [imagesPreview, setImagesPreview] = useState<string | null>(null);
  const fileInputCompanyRef = useRef<HTMLInputElement | null>(null);
  const [companyLogoPath, setCompanyLogoPath] = React.useState<File | null>(null,);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null,);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(TestimonialEditSchema),
  });

  const handleBack = () => { router.push("/user/testimonials"); };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await getTestimonialById(id);
        const data = (res as any).result || res;
        setValue("name", data.name || "");
        setValue("desig", data.desig || "");
        setValue("image", data.image || "");
        setValue("description", data.description || "");
        setValue("company_logo", data.company_logo || "");
        if (data.image) {
          setImagesPreview(
            `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.image}`,
          );
        }
        if (data.image) {
          setCompanyLogoPreview(
            `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.company_logo}`,
          );
        }
      } catch (error) {
        SwalError({
          title: "Error",
          message: "Failed to load testimonial data.",
        });
        handleBack();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("desig", data.desig);
      formData.append("description", data.description);
      if (imagesPath) { formData.append("image", imagesPath); }
      if (companyLogoPath) { formData.append("company_logo", companyLogoPath); }
      const response: any = await updateTestimonial(id, formData);

      if (response?.status === true) {
        SwalSuccess("Testimonial has been updated successfully.");
        router.push("/user/testimonials");
      } else {
        SwalError({
          title: "Failed!",
          message: response?.message || "Failed to update testimonial.",
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
              Edit Testimonial
            </h1>
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
              {/* name */}
              <div>
                <Label htmlFor="name">
                  Name <span className="text-red-600">*</span>
                </Label>
                <Input id="name" {...register("name")} placeholder="Enter Name" />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>
              {/* desig */}
              <div>
                <Label htmlFor="desig">
                  Designation
                </Label>
                <Input
                  id="desig"
                  {...register("desig")}
                  placeholder="Enter Designation"
                />
                {errors.desig && (
                  <p className="text-red-600 text-sm">{errors.desig.message}</p>
                )}
              </div>
              {/* Image */}
              <div>
                <Label htmlFor="image">
                  Image {" "}
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
                      setImagesPath(null);
                      setImagesPreview(null);
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
                      setImagesPath(null);
                      setImagesPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      return;
                    }

                    setValue("image", file, { shouldValidate: true });
                    setImagesPath(file);
                    setImagesPreview(URL.createObjectURL(file));
                  }}
                />

                {errors.image && (
                  <p className="text-red-600 text-sm">
                    {errors.image.message as string}
                  </p>
                )}
              </div>
              {/* Company Logo */}
              <div>
                <Label htmlFor="company_logo">
                  Company Logo {" "}
                  <p className="inline text-xs text-gray-500 mt-1">
                    Upload only (.jpg, .jpeg, and .png)
                  </p>
                </Label>
                <Input
                  ref={fileInputCompanyRef}
                  id="company_logo"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) {
                      setValue("company_logo", null, { shouldValidate: true });
                      setCompanyLogoPath(null);
                      setCompanyLogoPreview(null);
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
                      setValue("company_logo", null, { shouldValidate: true });
                      setCompanyLogoPath(null);
                      setCompanyLogoPreview(null);
                      if (fileInputCompanyRef.current) {
                        fileInputCompanyRef.current.value = "";
                      }
                      return;
                    }

                    setValue("company_logo", file, { shouldValidate: true });
                    setCompanyLogoPath(file);
                    setCompanyLogoPreview(URL.createObjectURL(file));
                  }}
                />

                {errors.company_logo && (
                  <p className="text-red-600 text-sm">
                    {errors.company_logo.message as string}
                  </p>
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
