"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { User } from "@/types/user";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { EnquiryAttributes } from "@/types/enquiry"
import { createEnquiry } from "@/services/enquiry.service";
import { enquirySchema } from "@/schemas/enquiry.schema";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
interface DefaultProps { project?: User; };
type FormData = z.infer<typeof enquirySchema>;

export default function Contact({ project }: DefaultProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(enquirySchema) as any,
    });

    const onSubmit = async (data: FormData) => {
        try {

            const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Enquiry Received - {COMPANY_NAME}</title>
  <style>
    body, table, td {
      font-family: 'Manrope', Arial, Helvetica, sans-serif;
    }
    img {
      border: none;
      display: block;
      outline: none;
      text-decoration: none;
    }
  </style>
</head>

<body style="margin:0; padding:0; background-color:#f4f6fa; font-family:'Manrope', Arial, sans-serif; color:#1a1a1a;">

  <!-- Background Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6fa" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff"
               style="border-radius:16px; overflow:hidden; box-shadow:0 6px 25px rgba(0,0,0,0.07);">

          <!-- Hero Section -->
          <tr>
            <td align="center" background="https://navlokcolonizers.com/wp-content/uploads/2025/08/contact-bnr-1536x405.jpg"
                style="background-size:cover; background-position:center; padding:60px 20px; text-align:center; color:#ffffff;">
              <div style="background-color:rgba(10,35,66,0.85); border-radius:12px; padding:30px 20px; display:inline-block;">
                <img src="{LOGO_URL}" alt="{COMPANY_NAME}" style="max-height:65px; margin-bottom:18px;" />
                <h1 style="margin:0; font-size:24px; font-weight:700; color:#ffffff;">We’ve Received Your Enquiry</h1>
                <p style="margin:10px 0 0; font-size:15px; color:#e0e6f5;">Thank you for contacting {COMPANY_NAME}</p>
              </div>
            </td>
          </tr>

          <!-- Body Section -->
          <tr>
            <td style="padding:40px; font-size:16px; line-height:1.7; color:#333;">
              <p style="margin:0 0 15px 0; font-size:20px; font-weight:700; color:#0a2342;">
                Hi {NAME},
              </p>
              <p style="margin:0 0 16px;">
                We appreciate your interest in <strong>{COMPANY_NAME}</strong>.  
                Your enquiry has been received successfully, and one of our team members will get in touch with you within <strong>24–48 hours</strong>.
              </p>

              <!-- Enquiry Summary -->
              <div style="margin:25px 0; background-color:#f8fafc; border-left:4px solid #1e3a8a; border-radius:8px; padding:16px 20px;">
                <p style="margin:0 0 6px; font-weight:600; color:#0a2342;">Enquiry Subject:</p>
                <p style="margin:0; color:#333;">{SUBJECT}</p>
              </div>

              <p style="margin:0 0 18px;">
                If your enquiry is urgent, you can call us directly at 
                <a href="tel:{COMPANY_PHONE}" style="color:#1e3a8a; font-weight:600; text-decoration:none;">
                  {COMPANY_PHONE}
                </a>
                or simply reply to this email.
              </p>

              <p style="margin:0;">
                Thank you for choosing <strong>{COMPANY_NAME}</strong> — we’re excited to assist you.<br/>
                — The {COMPANY_NAME} Team
              </p>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td align="center" style="padding:10px 40px 50px;">
              <a href="{SITE_URL}"
                 style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);
                        color:#ffffff; text-decoration:none; padding:14px 36px;
                        border-radius:8px; font-weight:700; font-size:16px;
                        letter-spacing:0.3px; display:inline-block;">
                Visit Our Website
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td align="center" style="padding:0 40px;">
              <hr style="border:0; height:1px; background-color:#e5e7eb; margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#0a2342; padding:25px; color:#e0e6f5; font-size:13px;">
              <p style="margin:0 0 8px;">© {DATE} {COMPANY_NAME}. All rights reserved.</p>
              <p style="margin:0;">
                <a href="{SITE_URL}" style="color:#3b82f6; text-decoration:none;">Visit Site</a> | 
                <a href="mailto:{COMPANY_EMAIL}" style="color:#3b82f6; text-decoration:none;">Contact Support</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
                        `
                .replaceAll('{NAME}', data?.name)
                .replaceAll('{SUBJECT}', data?.subject)
                .replaceAll('{COMPANY_PHONE}', project?.mobile_no)
                .replaceAll('{COMPANY_NAME}', project?.company_name)
                .replaceAll('{SITE_URL}', `https://${project?.subdomain}.baaraat.com`)
                .replaceAll('{DATE}', `${new Date().getFullYear()}`)
                .replaceAll('{LOGO_URL}', `https://navlokcolonizers.com/wp-content/uploads/2025/08/logo-300x141.png`);

            const payload: EnquiryAttributes = {
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                subject: data.subject,
                html: html,
                company_name: project?.company_name,
                company_email: project?.email,
            };
            const response: any = await createEnquiry(project?.schema_name, payload);
            if (response?.status === true) {
                SwalSuccess("enquiry submitted successfully.");
                reset({
                    name: "",
                    email: "",
                    mobile: "",
                    subject: "",
                });
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

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
        }),
    };

    return (
        <div>
            <section className="relative flex w-full min-h-[469px] items-center justify-center overflow-hidden">
                {/* Background image */}
                <img
                    src="https://c.animaapp.com/mhd81w7aWvI44g/img/frame-1000004022.png"
                    alt="Contact Us Background"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.58)]" />

                {/* Animated heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 flex items-center justify-center translate-y-[-1rem]"
                >
                    <h1 className="text-white text-4xl font-medium font-[Manrope] tracking-wide">
                        Contact Us
                    </h1>
                </motion.div>
            </section>

            <section className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-6 sm:px-12 lg:px-24 py-20 w-full bg-gradient-to-b from-white via-[#f8f8f8] to-[#f1f1f1] overflow-hidden">

                {/* Left Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col w-full lg:w-1/2 items-start justify-center gap-6"
                >
                    <motion.h2
                        variants={fadeUp}
                        custom={0}
                        className="text-2xl sm:text-3xl font-semibold text-gray-900 font-manrope"
                    >
                        Let&apos;s Start a Conversation
                    </motion.h2>

                    <motion.p
                        variants={fadeUp}
                        custom={1}
                        className="text-gray-700 font-light text-base sm:text-lg"
                    >
                        Our support team is here to guide you—no matter how big or small your concern.
                    </motion.p>

                    <div className="flex flex-col gap-5 w-full mt-4">
                        <div className="flex flex-col gap-5">
                            {/* Phone */}
                            <motion.div
                                variants={fadeUp}
                                custom={1}
                                className="group flex items-center gap-5 bg-white/60 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg rounded-xl border border-gray-100 p-5 transition-all duration-300"
                            >
                                <div className="flex items-center justify-center w-14 h-14 bg-[#000216] rounded-full p-3">
                                    <img
                                        className="w-7 h-7 invert transition-transform duration-300 group-hover:scale-110"
                                        alt="Phone"
                                        src="https://c.animaapp.com/mhd81w7aWvI44g/img/phone-fill.svg"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-base">Phone No.</h3>
                                    <p className="text-gray-600 text-sm font-light">
                                        {project?.mobile_no || "N/A"}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                variants={fadeUp}
                                custom={2}
                                className="group flex items-center gap-5 bg-white/60 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg rounded-xl border border-gray-100 p-5 transition-all duration-300"
                            >
                                <div className="flex items-center justify-center w-14 h-14 bg-[#000216] rounded-full p-3">
                                    <img
                                        className="w-7 h-7 invert transition-transform duration-300 group-hover:scale-110"
                                        alt="Email"
                                        src="https://c.animaapp.com/mhd81w7aWvI44g/img/phone-fill-4.svg"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-base">Email</h3>
                                    <p className="text-gray-600 text-sm font-light">
                                        {project?.email || "N/A"}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Address */}
                            <motion.div
                                variants={fadeUp}
                                custom={3}
                                className="group flex items-center gap-5 bg-white/60 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg rounded-xl border border-gray-100 p-5 transition-all duration-300"
                            >
                                <div className="flex items-center justify-center w-14 h-14 bg-[#000216] rounded-full p-3">
                                    <img
                                        className="w-7 h-7 invert transition-transform duration-300 group-hover:scale-110"
                                        alt="Address"
                                        src="https://c.animaapp.com/mhd81w7aWvI44g/img/phone-fill-1.svg"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-base">Address</h3>
                                    <p className="text-gray-600 text-sm font-light">
                                        {project?.address1 || "N/A"}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={4}
                    className="w-full lg:w-1/2"
                >
                    <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit(onSubmit)}>

                        <Card className="bg-white shadow-lg hover:shadow-2xl border-0 rounded-2xl transition-shadow duration-300">
                            <CardContent className="flex flex-col gap-1 sm:gap-4 p-6 sm:p-8">
                                <Input
                                    name="name"
                                    className="bg-white-500"
                                    placeholder="Full Name"
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

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-4 bg-[#000216] hover:bg-[#000216]/90 text-white font-semibold rounded-lg py-3 text-sm transition-transform hover:scale-[1.02]">
                                    {isSubmitting ? (
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        "Send Message"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </form>
                </motion.div>
            </section>
        </div>
    );
}
