"use client";

import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import { logout, getRole } from "@/lib/auth";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { updateUser } from "@/services/userService";
import { getUserById } from "@/services/userService";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { updateUserSchema } from "@/schemas/userSchema";
import { User } from "@/types/user";
import Loader from '@/components/ui/loader'
import ImageUpload from "@/components/SimpleImageUpload";
type FormData = z.infer<typeof updateUserSchema>;

export default function UpdateUser() {
    const router = useRouter();
    const params = useParams();
    const id = String(params.id);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(updateUserSchema) as any,
        mode: "onSubmit",
        reValidateMode: "onChange",
        shouldFocusError: true,
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedCompanyLogo, setSelectedCompanyLogo] = useState<File | null>(null);
    const [previewCompanyLogo, setPreviewCompanyLogo] = useState<string | null>(null);

    const handleBack = () => {
        router.back();
    };

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            if (!id) {
                SwalError({ title: "Error", message: "OOPS Session expired. Login again." });
                logout();
            };
            try {
                const res: any = await getUserById(id);
                const data: User = res?.result;
                reset({
                    name: data.name || "",
                    email: data.email || "",
                    company_name: data.company_name ? String(data.company_name) : "",
                    mobile_no: data.mobile_no ? String(data.mobile_no) : "",
                    office_no: data.office_no ? String(data.office_no) : "",
                    fax_no: data.fax_no ? String(data.fax_no) : "",
                    fburl: data.fburl || "",
                    xurl: data.xurl || "",
                    instaurl: data.instaurl || "",
                    linkedinurl: data.linkedinurl || "",
                    yturl: data.yturl || "",
                    address1: data.address1 || "",
                    address2: data.address2 || "",
                    gstin: data.gstin || "",
                    image: (`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.image}`) || "",
                });
                if (data?.image != null && data.image !== "") {
                    setPreviewImage(`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.image}`);
                }
                if (data?.company_logo != null && data.company_logo !== "") {
                    setPreviewCompanyLogo(`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.company_logo}`);
                }

            } catch (error) {
                // console.log("error", error);
                SwalError({ title: "Error", message: "Failed to load data." });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
            // appendIfValid("company_name", data.company_name);
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

            // ✅ Append files only if user selected new ones
            if (selectedImage instanceof File && selectedImage.size > 0) {
                formData.append("image", selectedImage);
            }
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
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong.",
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

                            {/** Profile */}
                            <div className="col-span-full flex items-center gap-6 mb-4">

                                {/* Profile Preview */}
                                {/* <div className="w-32 h-32 rounded-lg overflow-hidden flex items-center border-2 border-gray-300">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Company Logo"
                                            className="object-cover w-auto h-auto"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                                            No Logo
                                        </div>
                                    )}
                                </div> */}
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
                                                    setPreviewImage(URL.createObjectURL(file));
                                                }}
                                                defaultImage={previewImage ?? " "}
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
                                {typeof errors?.company_logo?.message === "string" && (
                                    <p className="text-red-500 text-sm">{errors.company_logo.message}</p>
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
                                    placeholder="Email"
                                    disabled
                                    {...register("email")}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Company Name */}
                            <div className="flex flex-col">
                                <Label htmlFor="company_name" className="mb-1 font-medium">
                                    Company Name <span className="text-red-600">*</span> (Be careful it's your db name)
                                </Label>
                                <Input
                                    id="company_name"
                                    type="text"
                                    placeholder="Company Name"
                                    disabled
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
                                        const sanitized = pasted.replace(/[^A-Z0-9]/g, "");
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
                                <Label htmlFor="fax_no" className="mb-1 font-medium">
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

                            {/* Blank */}
                            <div></div>

                            {/** Address 1 */}
                            <div className="flex flex-col">
                                <Label htmlFor="address1" className="mb-1 font-medium">
                                    Address <span className="text-red-600">*</span>
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