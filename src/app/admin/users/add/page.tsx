"use client";

import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff, Lock, ChevronDown } from 'lucide-react';
import ProfileImageUpload from "@/components/ProfileImageUpload";
import ImageUpload from "@/components/SimpleImageUpload";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { createUser } from "@/services/userService";
import { viewAllWebsiteType } from "@/services/theme.service";
import { WebsiteTypeAttribute } from '@/types/theme';
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { addUserSchema } from "@/schemas/userSchema";
import Loader from '@/components/ui/loader'
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
            image: null,
            company_logo: null,
        },
    });
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedCompanyLogo, setSelectedCompanyLogo] = useState<File | null>(null);
    const [previewCompanyLogo, setPreviewCompanyLogo] = useState<string | null>(null);
    const [websiteTypes, setWebsiteTypes] = useState<WebsiteTypeAttribute[]>([]);

    const handleBack = () => {
        router.back();
    };

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
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("company_name", data.company_name);
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
            if (selectedImage) {
                formData.append("image", selectedImage);
            }
            if (selectedCompanyLogo) {
                formData.append("company_logo", selectedCompanyLogo);
            }
            const response = await createUser(formData);
            if (response?.status === true) {
                SwalSuccess("User registered successfully."); handleBack(); // If you want to go back
            } else {
                SwalError({ title: "Failed!", message: response?.message || "Failed to create user.", });
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
                        <h1 className="text-xl font-medium text-gray-800 ml-2">Create User</h1>
                    </div>
                </div>
            </header>
            <main className="mx-auto px-4 sm:px-6 lg:px-8 lg:mx-24 py-4 ">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">

                    {/** Inputs of all fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

                        {/** Profile */}
                        <div className="col-span-full flex items-center gap-6 mb-4">
                            {/* Profile Image */}
                            <div className="relative w-32 h-32">
                                <Controller
                                    name="image"
                                    control={control}
                                    rules={{ required: "Profile image is required" }}
                                    render={({ field }) => (
                                        <ProfileImageUpload
                                            onFileSelect={(file) => {
                                                field.onChange(file);       // update React Hook Form
                                                setSelectedImage(file);     // update local state
                                            }}
                                            defaultImage={null}
                                        />
                                    )}
                                />
                            </div>
                            {/* Upload Info / Message */}
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 leading-snug">
                                    Upload only{" "}
                                    <span className="font-medium text-gray-700">
                                        JPG, JPEG, PNG, GIF, TIFF, or WEBP
                                    </span>
                                    . <br />
                                    Max size: <span className="font-medium text-gray-700">2 MB</span>. <br />
                                    Recommended: <span className="font-medium text-gray-700">128×128 px</span>.
                                </p>
                                {typeof errors?.image?.message === "string" && (
                                    <p className="text-red-500 text-sm">{errors.image.message}</p>
                                )}
                            </div>
                            {/* Simple Image Preview */}
                            <div className="w-32 h-32 rounded-2 overflow-hidden flex items-center border-2 border-gray-300">
                                {previewCompanyLogo ? (
                                    <img
                                        src={previewCompanyLogo}
                                        alt="Company Logo"
                                        className="object-cover w-auto h-auto"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                                        No Logo
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="flex flex-col">
                            <Label htmlFor="name" className="mb-1 font-medium">
                                Name <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Name"
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
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Company Logo */}
                        <div className="flex flex-col">
                            <Label htmlFor="company_logo" className="mb-1 font-medium">
                                Company Logo <span className="text-red-600">*</span>
                            </Label>
                            <div className="">
                                <Controller
                                    name="company_logo"
                                    control={control}
                                    rules={{ required: "Company logo is required" }}
                                    render={({ field }) => (
                                        <ImageUpload
                                            defaultImage={previewCompanyLogo || "/default-placeholder.png"} // preview URL
                                            onFileSelect={(file: File) => {
                                                field.onChange(file); // store File in React Hook Form
                                                setPreviewCompanyLogo(URL.createObjectURL(file)); // store preview string
                                                setSelectedCompanyLogo(file);
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.company_logo && <p className="text-red-500 text-sm">{errors?.company_logo?.message}</p>}

                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <Label htmlFor="email" className="mb-1 font-medium">
                                Email <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                // disabled
                                {...register("email")}
                                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <Label htmlFor="password" className="mb-1 font-medium">
                                Password <span className="text-red-600">*</span>
                            </Label>

                            <div className="relative">
                                {/* Lock Icon */}
                                <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400 pointer-events-none" />
                                {/* Input */}
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    {...register("password")}
                                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\s/g, "");
                                        setValue("password", value, { shouldValidate: true });
                                    }}
                                    className="pl-10 pr-10 h-9 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />


                                {/* Show/Hide Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>

                            {/* Error Message */}
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Company Name */}
                        <div className="flex flex-col">
                            <Label htmlFor="name" className="mb-1 font-medium">
                                Company Name <span className="text-red-600">*</span> (Be careful it's your db name)
                            </Label>
                            <Input
                                id="company_name"
                                type="text"
                                placeholder="Company Name"
                                {...register("company_name")}
                                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={50}
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const target = e.currentTarget;
                                    // Allow only letters, underscore, and hyphen
                                    target.value = target.value.replace(/[^A-Za-z_-]/g, "");
                                }}
                                onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                                    const paste = e.clipboardData.getData("text");
                                    // Block paste if it contains invalid characters
                                    if (/[^A-Za-z_-]/.test(paste)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            {typeof errors?.company_name?.message === "string" && (
                                <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>
                            )}
                        </div>

                        {/* Theme */}
                        <div className="flex flex-col">
                            <Label htmlFor="website_type" className="mb-1 font-medium">
                                Theme <span className="text-red-600">*</span>
                            </Label>
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
                            {errors.website_type && (
                                <p className="text-red-600 text-sm mt-1">{errors.website_type.message}</p>
                            )}
                        </div>

                        {/* GST no. */}
                        <div className="flex flex-col">
                            <Label htmlFor="gstin" className="mb-1 font-medium">
                                GST No. (If you have)
                            </Label>
                            <Input
                                id="gstin"
                                type="text"
                                placeholder="GSTIN (e.g. 22AAAAA0000A1Z5)"
                                maxLength={15}
                                {...register("gstin")}
                                onChange={(e) => {
                                    // Convert to uppercase & remove special characters
                                    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                                    register("gstin").onChange(e); // update React Hook Form state
                                }}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    const pasted = e.clipboardData.getData("text").toUpperCase().trim();
                                    const sanitized = pasted.replace(/[^A-Z0-9]/g, ""); // remove special chars
                                    e.currentTarget.value = sanitized.slice(0, 15);
                                    register("gstin").onChange(e);
                                }}
                                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {typeof errors?.gstin?.message === "string" && (
                                <p className="text-red-500 text-sm mt-1">{errors.gstin.message}</p>
                            )}
                        </div>

                        {/* Mobile */}
                        <div className="flex flex-col">
                            <Label htmlFor="mobile_no" className="mb-1 font-medium">
                                Mobile No. <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="mobile_no"
                                type="text"
                                placeholder="Mobile number"
                                maxLength={13} // ensure max 10 digits
                                {...register("mobile_no")}
                                onInput={(e) => {
                                    let val = e.currentTarget.value;

                                    // Remove non-digits except optional + at the start
                                    if (val.startsWith("+")) {
                                        val = "+" + val.slice(1).replace(/\D/g, "");
                                    } else {
                                        val = val.replace(/\D/g, "");
                                    }

                                    // Handle possible formats
                                    if (val.startsWith("+91")) {
                                        val = "+91" + val.slice(3, 13); // Max 10 digits after +91
                                        const numPart = val.slice(3);
                                        if (numPart && !/^[6-9]/.test(numPart)) {
                                            val = "+91"; // Reset if not starting with 6-9
                                        }
                                    } else if (val.startsWith("91")) {
                                        val = "91" + val.slice(2, 12); // Max 10 digits after 91
                                        const numPart = val.slice(2);
                                        if (numPart && !/^[6-9]/.test(numPart)) {
                                            val = "91";
                                        }
                                    } else {
                                        val = val.slice(0, 10);
                                        if (val && !/^[6-9]/.test(val)) {
                                            val = ""; // Reset if invalid start
                                        }
                                    }

                                    e.currentTarget.value = val;
                                }}
                                onPaste={(e) => {
                                    const pasteData = e.clipboardData.getData("text").trim();

                                    // Allow only valid Indian numbers (+91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX)
                                    const validPattern = /^(\+91|91)?[6-9]\d{9}$/;
                                    if (!validPattern.test(pasteData)) {
                                        e.preventDefault();
                                    }
                                }}

                                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.mobile_no && (
                                <p className="text-red-500 text-sm mt-1">{errors.mobile_no.message}</p>
                            )}
                        </div>

                        {/* Office No. */}
                        <div className="flex flex-col">
                            <Label htmlFor="office_no" className="mb-1 font-medium">
                                Phone No. (max 4, comma-separated)
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

                        {/* Fax no. */}
                        <div className="flex flex-col">
                            <Label htmlFor="dax" className="mb-1 font-medium">
                                Fax No.
                            </Label>
                            <Input
                                id="fax_no"
                                type="text"
                                placeholder="Fax number"
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

                        {/* Facebook */}
                        <div className="flex flex-col">
                            <Label htmlFor="fburl" className="mb-1 font-medium">
                                Facebook
                            </Label>
                            <Input
                                id="fburl"
                                placeholder="Facebook url"
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
                                Twitter
                            </Label>
                            <Input
                                id="xurl"
                                placeholder="Twitter url"
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
                                Instagram
                            </Label>
                            <Input
                                id="instaurl"
                                placeholder="Instagram url"
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
                                LinkedIn
                            </Label>
                            <Input
                                id="linkedinurl"
                                placeholder="LinkedIn url"
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
                                Youtube
                            </Label>
                            <Input
                                id="yturl"
                                placeholder="Youtube url"
                                {...register("yturl")}
                                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.yturl && (
                                <p className="text-red-500 text-sm mt-1">{errors.yturl.message}</p>
                            )}
                        </div>

                        {/* // Blank 
                        <div className="_blankfor"> </div> 
                        */}

                        {/** Address */}
                        <div className="flex flex-col">
                            <Label htmlFor="address1" className="mb-1 font-medium">
                                Current Address <span className="text-red-600">*</span>
                            </Label>
                            <Textarea
                                id="address1"
                                placeholder="Enter current address"
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
                                Parmanent Address
                            </Label>
                            <Textarea
                                id="address2"
                                placeholder="Enter parmanent address"
                                {...register("address2")}
                                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.address2 && (
                                <p className="text-red-500 text-sm mt-1">{errors.address2.message}</p>
                            )}
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
