"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { EnquiryAttributes } from "@/types/enquiry"
import { createEnquiry } from "@/services/enquiry.service";
import { enquirySchema } from "@/schemas/enquiry.schema";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { motion, Variants } from "framer-motion";
import { User } from "@/types/user";

interface DefaultProps {
    project?: User;
};

type FormData = z.infer<typeof enquirySchema>;

export default function Contact({ project }: DefaultProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(enquirySchema) as any,
    });

    const onSubmit = async (data: FormData) => {
        try {
            const payload: EnquiryAttributes = {
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                subject: data.subject,
            };
            const response: any = await createEnquiry(project?.company_name, payload);
            if (response?.status === true) {
                SwalSuccess("enquiry submitted successfully.");
                router.push("/");
            } else {
                SwalError({
                    title: "Failed!",
                    message: response?.message ?? "Failed to connect.",
                });
            }
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

    const itemVariants:Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    return (
        <div className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]">
            <div
                className="flex h-[450px] items-center justify-center w-full bg-cover bg-center bg-no-repeat relative"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://c.animaapp.com/mghk811dbdG4xS/img/hero.png')",
                }}
            >
                <h1 className="text-white text-4xl md:text-5xl font-bold font-poppins">
                    Contact
                </h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 p-20 relative self-stretch w-full flex-[0_0_auto] -mt-10 bg-white rounded-[40px_40px_0px_0px]">
                <div className="flex flex-wrap items-center justify-center gap-[40px_40px] relative self-stretch w-full flex-[0_0_auto] mt-[-1.00px] mb-[-1.00px] ml-[-1.00px] mr-[-1.00px] border border-solid border-[#d5d0d0]">
                    <motion.div
                        variants={itemVariants}
                        className="flex-shrink-0 w-full lg:w-1/3 h-full flex justify-center items-center bg-white"
                    >
                        <img
                            className="w-full h-[500px] object-cover rounded-none lg:rounded-l-2xl"
                            alt="Contact Us"
                            src="https://c.animaapp.com/mghk811dbdG4xS/img/image-36-1.png"
                        />
                    </motion.div>

                    {/* Right Content */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col w-full lg:w-1/2 p-8 md:p-12 gap-6"
                    >
                        {/* Heading */}
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-4xl font-bold text-gray-900 font-poppins">
                                Let’s Start a Conversation
                            </h2>
                            <p className="text-base md:text-lg text-gray-700 font-medium">
                                Our support team is here to guide you—no matter how big or small your concern.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>

                            <Input
                                name="name"
                                className="bg-white-500"
                                placeholder="Name"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}

                            <Input
                                name="email"
                                className="bg-white-500"
                                placeholder="Email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                            <Input
                                name="phone"
                                type="text"
                                placeholder="Phone"
                                className="bg-white-500"
                                {...register("mobile")}
                                maxLength={13}
                                {...register("mobile")}
                                onInput={(e) => {
                                    let val = e.currentTarget.value;

                                    if (val.startsWith("+")) {
                                        val = "+" + val.slice(1).replace(/\D/g, "");
                                    } else {
                                        val = val.replace(/\D/g, "");
                                    }
                                    if (val.startsWith("+91")) {
                                        val = "+91" + val.slice(3, 13);
                                    }
                                    else if (val.startsWith("91")) {
                                        val = "91" + val.slice(2, 12);
                                    }
                                    else if (val.startsWith("0")) {
                                        val = val.replace(/^0+/, "0"); // collapse multiple 0s
                                        val = val.slice(0, 11); // 0 + 10 digits
                                        // must not start with 0 followed by 1–5
                                        if (/^0[1-5]/.test(val)) {
                                            val = "0"; // reset to just "0" (invalid input beyond that)
                                        }
                                    }
                                    else if (/^[6-9]/.test(val)) {
                                        val = val.slice(0, 10);
                                    }
                                    else if (/^[1-5]/.test(val)) {
                                        val = "";
                                    }
                                    else {
                                        val = val.slice(0, 10);
                                    }

                                    e.currentTarget.value = val;
                                }}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    let val = e.clipboardData.getData("text");
                                    if (val.startsWith("+")) {
                                        val = "+" + val.slice(1).replace(/\D/g, "");
                                    } else {
                                        val = val.replace(/\D/g, "");
                                    }

                                    if (val.startsWith("+91")) {
                                        val = "+91" + val.slice(3, 13);
                                        if (/^\+91[0-5]/.test(val)) val = "+91";
                                    } else if (val.startsWith("91")) {
                                        val = "91" + val.slice(2, 12);
                                        if (/^91[0-5]/.test(val)) val = "91";
                                    } else if (val.startsWith("0")) {
                                        val = val.replace(/^0+/, "0");
                                        val = val.slice(0, 11);
                                        if (/^0[1-5]/.test(val)) val = "0";
                                    } else if (/^[6-9]/.test(val)) {
                                        val = val.slice(0, 10);
                                    } else if (/^[1-5]/.test(val)) {
                                        val = "";
                                    } else {
                                        val = val.slice(0, 10);
                                    }

                                    e.currentTarget.value = val;
                                }}
                            />
                            {errors.mobile && (
                                <p className="text-sm text-red-500">{errors.mobile.message}</p>
                            )}

                            <Textarea
                                name="message"
                                placeholder="Message"
                                {...register("subject")}
                                className="resize-none"
                            />
                            {errors.subject && (
                                <p className="text-sm text-red-500">{errors.subject.message}</p>
                            )}

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                variants={itemVariants}
                                className="relative mt-4 max-w-[120px] w-full inline-flex items-center justify-center bg-[#141414] text-white text-lg font-medium px-6 py-2 rounded-md overflow-hidden transition-all duration-300 group disabled:opacity-60"
                            >
                                {/* Button text or spinner */}
                                {isSubmitting ? (
                                    <span className="relative z-10 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <span className="relative z-10">Submit</span>
                                )}

                                {/* Hover background animation */}
                                <span className="absolute left-0 top-0 h-full w-0 bg-blue-500 transition-all duration-500 ease-in-out group-hover:w-full"></span>
                            </motion.button>

                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

//Contact-us Demo