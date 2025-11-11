"use client";

import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff, Lock, ChevronDown, HelpCircle } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent, } from "@/components/ui/popover";
import CompanyLogoUpload from "@/components/CompanyLogoUpload";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { createUser } from "@/services/userService";
import { viewAllWebsiteType } from "@/services/theme.service";
import { WebsiteTypeAttribute } from '@/types/theme';
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { addUserSchema } from "@/schemas/userSchema";
type FormData = z.infer<typeof addUserSchema>;

export default function AddUser() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(addUserSchema) as any,
        mode: "onSubmit",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: {
            company_logo: null,
        },
    });
    const [showPassword, setShowPassword] = useState(false);
    const [selectedCompanyLogo, setSelectedCompanyLogo] = useState<File | null>(null);
    const [websiteTypes, setWebsiteTypes] = useState<WebsiteTypeAttribute[]>([]);

    const handleBack = () => { router.back(); };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res: any = await viewAllWebsiteType();
                const data: WebsiteTypeAttribute[] = Array.isArray(res?.result?.data)
                    ? res.result.data : [];
                setWebsiteTypes(data); // ✅ just set state
            } catch (error) {
                SwalError({ title: "Failed!", message: error?.message ?? "Failed to load Themes.", });
            }
        };
        fetchData();
    }, []);

    // Watch state changes
    // useEffect(() => {
    //     console.log("websiteTypes after state update:", websiteTypes);
    // }, [websiteTypes]);

    const onSubmit = async (data: any) => {
        try {
            const schemaFriendlyName = data.company_name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_]/g, "");

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("company_name", data.company_name);
            formData.append("schema_name", schemaFriendlyName);
            formData.append("subdomain", data.subdomain);
            formData.append("website_type", data.website_type);
            formData.append("mobile_no", data.mobile_no.trim());
            formData.append("office_no", data.office_no.trim());
            formData.append("fax_no", data.fax_no.trim());
            formData.append("fburl", data.fburl.trim());
            formData.append("xurl", data.xurl.trim());
            formData.append("instaurl", data.instaurl.trim());
            formData.append("yturl", data.yturl.trim());
            formData.append("linkedinurl", data.linkedinurl.trim());
            formData.append("address1", data.address1);
            formData.append("address2", data.address2);
            formData.append("gstin", data.gstin);
            if (selectedCompanyLogo) {
                formData.append("company_logo", data.company_logo);
            }
            const response = await createUser(formData);
            if (response?.status === true) {
                SwalSuccess("Customer registered successfully."); handleBack(); // If you want to go back
            } else {
                SwalError({ title: "Failed!", message: response?.message || "Failed to register customer.", });
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
                        <h1 className="text-xl font-medium text-gray-800 ml-2">Register User</h1>
                    </div>
                </div>
            </header>
            <main className="mx-auto px-4 sm:px-6 lg:px-8 lg:mx-24 py-4 ">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">

                    {/** Inputs of all fields */}
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

                                        // ✅ Allow only digits (keep '+' only at start)
                                        if (val.startsWith("+")) {
                                            val = "+" + val.slice(1).replace(/\D/g, "");
                                        } else {
                                            val = val.replace(/\D/g, "");
                                        }

                                        // ✅ Handle Indian format (+91 or 10 digits)
                                        if (val.startsWith("+91")) {
                                            val = "+91" + val.slice(3, 13); // +91 + 10 digits max

                                            // 🚫 Block numbers starting with 0–5 after +91
                                            const firstDigit = val.charAt(3);
                                            if (/[0-5]/.test(firstDigit)) {
                                                val = "+91"; // reset if invalid start
                                            }
                                        } else {
                                            // ✅ Handle 10-digit local numbers only
                                            val = val.slice(0, 10);

                                            // 🚫 Block numbers starting with 0–5
                                            if (/^[0-5]/.test(val)) {
                                                val = ""; // clear invalid start
                                            }
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
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col">
                                <Label htmlFor="password" className="mb-1 font-medium">
                                    Password <span className="text-red-600">*</span>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        {...register("password")}
                                        onKeyDown={(e) => e.key === " " && e.preventDefault()}
                                        className="pl-10 pr-10 h-9 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                                )}
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
                                            {...register("website_type", { required: "Theme is required" })}
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

                            {/* Subdomain Name -- Company Logo */}
                            <div className="flex flex-col col-span-1 md:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

                                    {/* Left side: Subdomain + GST */}
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 col-span-1">
                                        {/* Subdomain */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Label htmlFor="subdomain" className="mb-1 font-medium">
                                                    Company Subdomain Name <span className="text-red-600">*</span>
                                                </Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <HelpCircle className="text-red-600 cursor-pointer w-5 h-5" />
                                                    </PopoverTrigger>

                                                    <PopoverContent className="w-80 text-sm text-gray-800 bg-white rounded-lg shadow-md border p-4 leading-relaxed">
                                                        <p className="font-semibold mb-2">Subdomain Naming Instructions:</p>
                                                        <p className="mb-2">
                                                            The subdomain you enter will be automatically created using a wildcard DNS configuration.
                                                        </p>
                                                        <p className="mb-2">
                                                            Example: if you enter <code>mycompany</code>, your site will be available at{" "}
                                                            <strong>mycompany.baaraat.com</strong>.
                                                        </p>
                                                        <p>
                                                            You can link a custom domain (like <strong>mycompany.com</strong>) anytime later.
                                                        </p>
                                                    </PopoverContent>
                                                </Popover>


                                            </div>
                                            <Input
                                                id="subdomain"
                                                type="text"
                                                placeholder="Enter Company Subdomain Name"
                                                {...register("subdomain")}
                                                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                maxLength={50}
                                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                                    const target = e.currentTarget;
                                                    let value = target.value.toLowerCase();

                                                    value = value.replace(/[^a-z0-9_-]/g, "");
                                                    value = value.replace(/^[-_]+/, "");

                                                    target.value = value;
                                                }}
                                                onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                                                    let paste = e.clipboardData.getData("text").toLowerCase();

                                                    if (/[^a-z0-9_-]/.test(paste) || /^[-_]/.test(paste)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {errors?.subdomain?.message && (
                                                <p className="text-red-500 text-sm mt-1">{errors.subdomain.message}</p>
                                            )}
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
                                                    defaultImage={null}
                                                />
                                            )}
                                        />
                                        {errors?.company_logo && (
                                            <p className="text-red-500 text-sm">{errors?.company_logo?.message}</p>
                                        )}
                                    </div>

                                </div>
                            </div>

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

                    {/** Submit & Back buttons */}
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