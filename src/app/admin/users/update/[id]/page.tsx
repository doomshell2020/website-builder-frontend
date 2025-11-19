"use client";

import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import CompanyLogoUpload from "@/components/CompanyLogoUpload";
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent, } from "@/components/ui/popover";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { updateUser } from "@/services/userService";
import { getUserById } from "@/services/userService";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { updateUserSchema } from "@/schemas/userSchema";
import { User } from "@/types/user";
import { viewAllThemes } from "@/services/theme.service";
import { ThemeAttribute } from '@/types/theme';
import Loader from '@/components/ui/loader'
type FormData = z.infer<typeof updateUserSchema>;

export default function UpdateUser() {
    const router = useRouter();
    const params = useParams();
    const id = String(params.id);
    const [loading, setLoading] = useState(false);
    const [imageFolder, setImageFolder] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(updateUserSchema) as any,
        mode: "onSubmit",
        reValidateMode: "onChange",
        shouldFocusError: true,
    });

    const [selectedCompanyLogo, setSelectedCompanyLogo] = useState<File | null>(null);
    const [previewCompanyLogo, setPreviewCompanyLogo] = useState<string | null>(null);
    const [websiteTypes, setWebsiteTypes] = useState<ThemeAttribute[]>([]);

    const handleBack = () => { router.back(); };

    useEffect(() => {
        let isMounted = true;
        const fetchAll = async () => {
            try {
                setLoading(true);

                // ✅ Fetch both user and themes in parallel
                const [userRes, themeRes] = await Promise.all([
                    getUserById(id),
                    viewAllThemes(),
                ]);

                // ✅ Prepare theme list
                const themeData: ThemeAttribute[] = Array.isArray(themeRes?.result?.data)
                    ? themeRes.result.data
                    : [];
                if (isMounted) setWebsiteTypes(themeData);

                // ✅ Prepare user data
                const data: User = userRes?.result;

                if (isMounted) {
                    reset({
                        name: data.name || "",
                        email: data.email || "",
                        company_name: data.company_name || "",
                        mobile_no: data.mobile_no || "",
                        office_no: data.office_no || "",
                        fax_no: data.fax_no || "",
                        fburl: data.fburl || "",
                        xurl: data.xurl || "",
                        instaurl: data.instaurl || "",
                        linkedinurl: data.linkedinurl || "",
                        yturl: data.yturl || "",
                        address1: data.address1 || "",
                        address2: data.address2 || "",
                        gstin: data.gstin || "",
                        gst_type: data.gst_type,
                        website_type: data?.Theme?.id ? data.Theme.id.toString() : "",
                    });

                    setImageFolder(data?.imageFolder);

                    if (data?.company_logo) {
                        setPreviewCompanyLogo(`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.company_logo}`);
                    }
                }
            } catch (error) {
                SwalError({
                    title: "Error",
                    message: "Failed to load user or theme data.",
                });
                handleBack();
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
        return () => { isMounted = false; };
    }, [id, reset]);

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            // ✅ Helper: append only non-empty values
            const appendIfValid = (key: string, value: any) => {
                if (
                    value === null ||
                    value === undefined ||
                    (typeof value === "string" && value.trim() === "")
                ) {
                    return;
                }
                formData.append(key, typeof value === "string" ? value.trim() : value);
            };
            appendIfValid("name", data.name);
            appendIfValid("email", data.email);
            appendIfValid("company_name", data.company_name);
            appendIfValid("mobile_no", data.mobile_no);
            appendIfValid("office_no", data.office_no);
            appendIfValid("fax_no", data.fax_no);
            appendIfValid("fburl", data.fburl);
            appendIfValid("xurl", data.xurl);
            appendIfValid("instaurl", data.instaurl);
            appendIfValid("yturl", data.yturl);
            appendIfValid("linkedinurl", data.linkedinurl);
            appendIfValid("address1", data.address1);
            appendIfValid("address2", data.address2);
            appendIfValid("gstin", data.gstin);
            appendIfValid("gst_type", data.gst_type);
            appendIfValid("imageFolder", imageFolder);
            appendIfValid("website_type", data.website_type);
            if (selectedCompanyLogo instanceof File && selectedCompanyLogo.size > 0) {
                formData.append("company_logo", selectedCompanyLogo);
            }
            // ✅ Call API
            const response = await updateUser(id, formData);

            if (response?.status === true) {
                SwalSuccess("Profile has been updated successfully.");
                handleBack();
            } else {
                SwalError({
                    title: "Failed!",
                    message: response?.message || "Failed to update profile.",
                });
            }
        } catch (error: any) {
            SwalError({
                title: "Failed!",
                message: error?.response?.data?.message || error?.message || "Something went wrong.",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-12">
                        <h1 className="text-xl font-medium text-gray-800 ml-2">Update User</h1>
                    </div>
                </div>
            </header>
            <main className="mx-auto px-4 sm:px-6 lg:px-8 lg:mx-24 py-4 ">
                {loading ? (<Loader />) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 p-6 bg-white rounded-lg shadow-md"
                    >
                        <div className="">

                            {/* ---------------- PERSONAL INFO SECTION ---------------- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black mt-4">
                                <div className="col-span-1 md:col-span-2">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h2>
                                    <hr className="border-gray-300 mb-2" />
                                </div>

                                {/* Name */}
                                <div className="flex flex-col">
                                    <Label htmlFor="name" className="mb-1 font-medium">
                                        Customer Name <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter Customer's Name"
                                        {...register("name")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                            const target = e.currentTarget;
                                            // Replace anything that is not a letter or space
                                            target.value = target.value.replace(/[^A-Za-z\s]/g, "");
                                        }}
                                        onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                                            const paste = e.clipboardData.getData("text");
                                            if (/[^A-Za-z\s]/.test(paste)) {
                                                e.preventDefault(); // block paste if it contains invalid chars
                                            }
                                        }}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                </div>

                                {/* Mobile No */}
                                <div className="flex flex-col">
                                    <Label htmlFor="mobile_no" className="mb-1 font-medium">
                                        Customer Mobile No. <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="mobile_no"
                                        type="text"
                                        placeholder="Enter Customer's Mobile No."
                                        {...register("mobile_no")}
                                        maxLength={13}
                                        onInput={(e) => {
                                            let val = e.currentTarget.value;
                                            if (val.startsWith("+")) {
                                                val = "+" + val.slice(1).replace(/\D/g, "");
                                            } else {
                                                val = val.replace(/\D/g, "");
                                            }
                                            if (val.startsWith("+91")) {
                                                val = "+91" + val.slice(3, 13);
                                            } else {
                                                val = val.slice(0, 10);
                                            }
                                            e.currentTarget.value = val;
                                        }}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.mobile_no && (
                                        <p className="text-red-500 text-sm mt-1">{errors.mobile_no.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="flex flex-col">
                                    <Label htmlFor="email" className="mb-1 font-medium">
                                        Email <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter Email Address"
                                        {...register("email")}
                                        disabled
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>

                            </div>

                            {/* ---------------- COMPANY DETAILS SECTION ---------------- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black mt-4">
                                {/* Section Header (spans full width) */}
                                <div className="col-span-1 md:col-span-2">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Company Details</h2>
                                    <hr className="border-gray-300 mb-2" />
                                </div>

                                {/* Company Name */}
                                <div className="flex flex-col">
                                    <Label htmlFor="company_name" className="mb-1 font-medium">
                                        Company Name <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="company_name"
                                        type="text"
                                        placeholder="Enter Company Name"
                                        {...register("company_name")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        maxLength={50}
                                    />
                                    {errors?.company_name?.message && (
                                        <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>
                                    )}
                                </div>

                                {/* Company Theme */}
                                <div className="flex flex-col">
                                    <Label htmlFor="website_type" className="mb-1 font-medium">
                                        Select Company Theme <span className="text-red-600">*</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="relative">
                                            <select
                                                id="website_type"
                                                {...register("website_type", { valueAsNumber: true })}
                                                className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>
                                                    --Select Theme--
                                                </option>
                                                {websiteTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown
                                                size={16}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                            />
                                        </div>
                                    </div>
                                    {errors.website_type && (
                                        <p className="text-red-600 text-sm mt-1">{errors.website_type.message}</p>
                                    )}
                                </div>

                                {/* Company Phone No. & Fax No. -- Company Logo */}
                                <div className="flex flex-col col-span-1 md:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

                                        {/* Left side: Company Phone No. & Fax No.*/}
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 col-span-1">

                                            {/* Company Phone No. */}
                                            <div className="flex flex-col">
                                                <Label htmlFor="office_no" className="mb-1 font-medium">
                                                    Company Phone No. (max 4, comma-separated)
                                                </Label>
                                                <Input
                                                    id="office_no"
                                                    type="text"
                                                    placeholder="+911234567890, +911234567891..."
                                                    {...register("office_no")}
                                                    onInput={(e) => {
                                                        let val = e.currentTarget.value;

                                                        // Split by comma and trim spaces
                                                        let numbers = val.split(",").map((num) => num.trim());

                                                        // Limit to max 4 numbers
                                                        if (numbers.length > 4) numbers = numbers.slice(0, 4);

                                                        // Process each number
                                                        numbers = numbers.map((num) => {
                                                            if (num.startsWith("+")) {
                                                                num = "+" + num.slice(1).replace(/\D/g, "");
                                                            } else {
                                                                num = num.replace(/\D/g, "");
                                                            }

                                                            if (num.startsWith("+91")) {
                                                                num = "+91" + num.slice(3, 13);
                                                            } else if (num.startsWith("0")) {
                                                                num = "0" + num.slice(1, 11);
                                                            } else {
                                                                num = num.slice(0, 10);
                                                            }

                                                            return num;
                                                        });

                                                        // Join numbers back with comma + space
                                                        e.currentTarget.value = numbers.join(", ");
                                                    }}
                                                    onPaste={(e) => {
                                                        const pasteData = e.clipboardData.getData("text");

                                                        // Only allow digits, commas, spaces, and optional leading +
                                                        if (!/^[\d,+\s]+$/.test(pasteData)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.office_no && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.office_no.message}</p>
                                                )}
                                            </div>

                                            {/* Company Fax No. */}
                                            <div className="flex flex-col">
                                                <Label htmlFor="fax_no" className="mb-1 font-medium">
                                                    Company Fax No.
                                                </Label>
                                                <Input
                                                    id="fax_no"
                                                    type="text"
                                                    placeholder="Company Fax no."
                                                    {...register("fax_no")}
                                                    onInput={(e) => {
                                                        let val = e.currentTarget.value;
                                                        if (val.startsWith("+")) {
                                                            val = "+" + val.slice(1).replace(/\D/g, "");
                                                        } else {
                                                            val = val.replace(/\D/g, "");
                                                        }
                                                        if (val.startsWith("+91")) {
                                                            // +91 + STD (2-4) + number (6-8) → max 13 digits
                                                            val = "+91" + val.slice(3, 13);
                                                        } else if (val.startsWith("0")) {
                                                            // 0 + STD + number → max 11 digits
                                                            val = "0" + val.slice(1, 11);
                                                        } else {
                                                            // No prefix → STD + number → max 10 digits
                                                            val = val.slice(0, 10);
                                                        }

                                                        e.currentTarget.value = val;
                                                    }}
                                                    onPaste={(e) => {
                                                        const pasteData = e.clipboardData.getData("text");

                                                        // Only allow digits and optional leading +
                                                        if (!/^\+?\d+$/.test(pasteData)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.fax_no && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.fax_no.message}</p>
                                                )}
                                            </div>

                                        </div>

                                        {/* Right side: Company Logo */}
                                        <div className="flex flex-col col-span-1">
                                            <Label htmlFor="company_logo" className="mb-1 font-medium">
                                                Company Logo <span className="text-red-600">*</span>
                                            </Label>
                                            <Controller
                                                name="company_logo"
                                                control={control}
                                                rules={{ required: "Company logo is required" }}
                                                render={({ field }) => (
                                                    <CompanyLogoUpload
                                                        onFileSelect={(file: File) => {
                                                            field.onChange(file);
                                                            setSelectedCompanyLogo(file);
                                                        }}
                                                        // defaultImage={null}
                                                        defaultImage={previewCompanyLogo ?? null}
                                                    />
                                                )}
                                            />
                                            {typeof errors?.company_logo?.message === "string" && (
                                                <p className="text-red-500 text-sm">{errors.company_logo.message}</p>
                                            )}

                                        </div>

                                    </div>
                                </div>

                                {/* Company GST No. */}
                                <div className="flex flex-col col-span-1 md:col-span-1">
                                    <Label htmlFor="gstin" className="mb-1 font-medium">
                                        Company GST No. (If you have)
                                    </Label>
                                    <Input
                                        id="gstin"
                                        type="text"
                                        placeholder="eg. 22AAAAA0000A1Z5"
                                        {...register("gstin")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        maxLength={15}
                                    />
                                    {errors?.gstin?.message && (
                                        <p className="text-red-500 text-sm mt-1">{errors.gstin.message}</p>
                                    )}
                                </div>

                                {/* GST type */}
                                <div className="flex flex-col gap-2">
                                    <Label className="mb-1 font-medium">
                                        GST Type <span className="text-red-600">*</span>
                                    </Label>

                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                                            <input
                                                type="radio"
                                                value="CGST_SGST"
                                                {...register("gst_type")}
                                                className="cursor-pointer"
                                            />
                                            CGST + SGST
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                                            <input
                                                type="radio"
                                                value="IGST"
                                                {...register("gst_type")}
                                                className="cursor-pointer"
                                            />
                                            IGST
                                        </label>
                                    </div>

                                    {errors.gst_type && (
                                        <p className="text-red-500 text-sm">{errors.gst_type.message}</p>
                                    )}
                                </div>

                            </div>

                            {/* ---------------- SOCIAL MEDIA lINKS SECTION ---------------- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black mt-4">
                                <div className="col-span-1 md:col-span-2">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Social Media Links</h2>
                                    <hr className="border-gray-300 mb-2" />
                                </div>

                                {/* Facebook */}
                                <div className="flex flex-col">
                                    <Label htmlFor="fburl" className="mb-1 font-medium">
                                        Facebook Page
                                    </Label>
                                    <Input
                                        id="fburl"
                                        placeholder="Enter Facebook URL"
                                        {...register("fburl")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.fburl && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fburl.message}</p>
                                    )}
                                </div>

                                {/* Twitter */}
                                <div className="flex flex-col">
                                    <Label htmlFor="xurl" className="mb-1 font-medium">
                                        Twitter Page
                                    </Label>
                                    <Input
                                        id="xurl"
                                        placeholder="Enter Twitter URL"
                                        {...register("xurl")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.xurl && (
                                        <p className="text-red-500 text-sm mt-1">{errors.xurl.message}</p>
                                    )}
                                </div>

                                {/* Instagram */}
                                <div className="flex flex-col">
                                    <Label htmlFor="instaurl" className="mb-1 font-medium">
                                        Instagram Page
                                    </Label>
                                    <Input
                                        id="instaurl"
                                        placeholder="Enter Instagram URL"
                                        {...register("instaurl")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.instaurl && (
                                        <p className="text-red-500 text-sm mt-1">{errors.instaurl.message}</p>
                                    )}
                                </div>

                                {/* LinkedIn */}
                                <div className="flex flex-col">
                                    <Label htmlFor="linkedinurl" className="mb-1 font-medium">
                                        LinkedIn Page
                                    </Label>
                                    <Input
                                        id="linkedinurl"
                                        placeholder="Enter LinkedIn URL"
                                        {...register("linkedinurl")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.linkedinurl && (
                                        <p className="text-red-500 text-sm mt-1">{errors.linkedinurl.message}</p>
                                    )}
                                </div>

                                {/* Youtube */}
                                <div className="flex flex-col">
                                    <Label htmlFor="yturl" className="mb-1 font-medium">
                                        Youtube Page
                                    </Label>
                                    <Input
                                        id="yturl"
                                        placeholder="Enter Youtube URL"
                                        {...register("yturl")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.yturl && (
                                        <p className="text-red-500 text-sm mt-1">{errors.yturl.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* ---------------- ADDRESS INFO SECTION ---------------- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black mt-4">
                                <div className="col-span-1 md:col-span-2">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Address Details</h2>
                                    <hr className="border-gray-300 mb-2" />
                                </div>
                                {/** Address 1 */}
                                <div className="flex flex-col">
                                    <Label htmlFor="address1" className="mb-1 font-medium">
                                        Current Address <span className="text-red-600">*</span>
                                    </Label>
                                    <Textarea
                                        id="address1"
                                        placeholder="Enter Current Address"
                                        {...register("address1")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.address1 && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>
                                    )}
                                </div>

                                {/** Address 2 */}
                                <div className="flex flex-col">
                                    <Label htmlFor="address2" className="mb-1 font-medium">
                                        Permanent Address
                                    </Label>
                                    <Textarea
                                        id="address2"
                                        placeholder="Enter Permanent Address"
                                        {...register("address2")}
                                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.address2 && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address2.message}</p>
                                    )}
                                </div>
                            </div>

                        </div>

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