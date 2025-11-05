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
import { faqSchema } from "@/schemas/faq.schema";
import { findFAQsCategories } from "@/services/faqcategory.service";
import { viewFAQ, updateFAQ } from "@/services/faq.service";
import { FAQAttributes } from '@/types/faq'
type FormData = z.infer<typeof faqSchema>;

export default function FaqEditForm() {

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
        resolver: zodResolver(faqSchema),
    });

    const [faqCategories, setFAQCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res: any = await viewFAQ(id);
                const data = res?.result;
                reset({ question: data.question || "", answer: data.answer || "", slug: data.slug || "", });
                const response: any = await findFAQsCategories();
                const categories = response?.result?.data ?? [];
                setFAQCategories(categories);
                setValue("category_id", data.category_id);
            } catch (error) {
                console.log("Error fetching FAQ:", error);
                SwalError({ title: "Error", message: "Failed to load FAQ data.", }); handleBack();
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, setValue]);

    const handleBack = () => {
        router.push("/user/faqs");
    };

    const onSubmit = async (data: FormData) => {
        try {
            const payload: FAQAttributes = {
                category_id: data.category_id,
                question: data.question,
                answer: data.answer,
                slug: data.slug,
            };
            const response: any = await updateFAQ(id, payload);
            if (response?.status === true) { SwalSuccess("FAQ updated successfully."); handleBack(); }
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
                        <h1 className="text-xl font-medium text-gray-800 ml-2">Edit FAQs</h1>
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

                            {/* Slug */}
                            <div>
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

                            {/* Categories */}
                            <div className="flex flex-col justify-end">
                                <Label htmlFor="category_id">Select Category</Label>
                                <select
                                    name="category_id"
                                    id="category_id"
                                    // {...register("category_id")}
                                    value={watch("category_id") || ""} // 👈 
                                    onChange={(e) => {
                                        const selectedName = Number(e.target.value);
                                        setValue("category_id", selectedName, { shouldValidate: true });
                                    }}
                                    className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 bg-white dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
                                >
                                    <option value="" disabled>-- Select Category --</option>
                                    {faqCategories.map((s) => (
                                        <option key={s.id} value={s.id} data-id={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-sm text-red-500">{errors.category_id.message}</p>
                                )}
                            </div>

                            {/* Question */}
                            <div className="flex flex-col">
                                <Label htmlFor="question" className="mb-1 font-medium">
                                    Question <span className="text-red-600">*</span>
                                </Label>
                                <Textarea
                                    id="question"
                                    placeholder="Enter Question"
                                    {...register("question")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.question && (
                                    <p className="text-red-500 text-sm mt-1">{errors.question.message}</p>
                                )}
                            </div>

                            {/* Answer */}
                            <div className="flex flex-col">
                                <Label htmlFor="answer" className="mb-1 font-medium">
                                    Answer <span className="text-red-600">*</span>
                                </Label>
                                <Textarea
                                    id="answer"
                                    placeholder="Enter Answer"
                                    {...register("answer")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.answer && (
                                    <p className="text-red-500 text-sm mt-1">{errors.answer.message}</p>
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
