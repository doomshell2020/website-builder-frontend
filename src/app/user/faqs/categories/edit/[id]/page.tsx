"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Loader from '@/components/ui/loader'
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { faqCategorySchema } from "@/schemas/faq.schema";
import { viewFAQCategory, updateFAQCategory } from "@/services/faqcategory.service";
import { FAQCategoryAttributes } from '@/types/faq'
type FormData = z.infer<typeof faqCategorySchema>;

export default function FaqCategoryEditForm() {

    const router = useRouter();
    const params = useParams();
    const id = String(params.id);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(faqCategorySchema),
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res: any = await viewFAQCategory(id);
                const data = res?.result;
                reset({
                    name: data.name || "",
                    slug: data.slug || "",
                    description: data.description || "",
                });
            } catch (error) {
                console.log("Error fetching FAQ category:", error);
                SwalError({ title: "Error", message: "Failed to load FAQ category data.", }); handleBack();
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, setValue]);

    const handleBack = () => {
        router.push("/user/faqs/categories");
    };

    const onSubmit = async (data: FormData) => {
        try {
            const payload: FAQCategoryAttributes = {
                name: data.name,
                slug: data.slug,
                description: data.description,
            };
            const response: any = await updateFAQCategory(id, payload);
            if (response?.status === true) { SwalSuccess("FAQ category updated successfully."); handleBack(); }
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
                        <h1 className="text-xl font-medium text-gray-800 ml-2">Edit FAQ Category</h1>
                    </div>
                </div>
            </header>

            {loading ? (<Loader />) : (
                <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 p-6 bg-white rounded-lg shadow-md"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

                            {/* Category Name */}
                            <div className="flex flex-col">
                                <Label htmlFor="name">
                                    Name <span className="text-red-600">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="Enter Name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Slug */}
                            <div className="flex flex-col">
                                <Label htmlFor="slug">
                                    Slug
                                </Label>
                                <Input
                                    id="slug"
                                    {...register("slug")}
                                    placeholder="Enter Slug" />

                                {errors.slug && (
                                    <p className="text-red-600 text-sm">
                                        {errors.slug.message as string}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col">
                                <Label htmlFor="description" className="mb-1 font-medium">
                                    Description <span className="text-red-600">*</span>
                                </Label>
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
            )}
        </div>
    );
};
