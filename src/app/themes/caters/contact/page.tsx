"use client";

import React, { useState } from "react";
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
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
interface DefaultProps { project?: User; };
type FormData = z.infer<typeof enquirySchema>;

export default function Contact({ project }: DefaultProps) {
    const router = useRouter();
    const [animate, setAnimate] = useState(false);

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
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Enquiry Received - {COMPANY_NAME}</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>

<body style="margin:0; padding:0; background-color:#f9f6f3; font-family:'Manrope', Arial, sans-serif; color:#2b2b2b;">

  <!-- Outer Table -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f6f3" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
          style="border-radius:16px; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.07);">

          <!-- Hero / Header -->
          <tr>
            <td align="center"
                style="background:linear-gradient(135deg, rgba(139,30,43,0.95) 0%, rgba(178,34,52,0.95) 40%, rgba(199,147,58,0.9) 100%), 
                       url('{HEADER_BG_IMAGE}') center/cover no-repeat;
                       padding:70px 30px; position:relative;">

              <!-- Logo -->
              <div style="background:rgba(255,255,255,0.9); border-radius:14px; padding:12px 24px;
                          display:inline-block; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
                <img src="{LOGO_URL}" alt="{COMPANY_NAME} Logo"
                     style="height:60px; display:block; margin:0 auto; object-fit:contain;" 
                     onerror="this.style.display='none';" />
              </div>

              <!-- Title -->
              <h1 style="color:#fffdf5; font-size:30px; font-weight:700; margin:28px 0 8px;">
                Enquiry Received ❤️
              </h1>

              <p style="color:#fde9d9; font-size:15px; margin:0;">
                Thank you for reaching out to <strong>{COMPANY_NAME}</strong> — we appreciate your trust.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:45px 40px 25px; font-size:16px; line-height:1.7; color:#2b2b2b;">
              <p style="margin:0 0 20px; font-size:18px; font-weight:600; color:#1f1f1f;">
                Hi {NAME},
              </p>

              <p style="margin:0 0 20px;">
                We’re delighted to receive your enquiry! Our catering team will carefully review your request and get back to you within <strong>24–48 hours</strong>.
              </p>

              <!-- Subject Box -->
              <div style="margin:25px 0; padding:18px 20px; background:#fff7f4;
                          border-left:4px solid #b22234; border-radius:8px;">
                <div style="font-weight:600; color:#8b1e2b; margin-bottom:6px;">Subject:</div>
                <div style="color:#4b2e2e; line-height:1.5;">{SUBJECT}</div>
              </div>

              <p style="margin:20px 0;">
                For urgent requests, please call us at  
                <a href="tel:{COMPANY_PHONE}" 
                   style="color:#b22234; font-weight:600; text-decoration:none;">{COMPANY_PHONE}</a>  
                or simply reply to this email.
              </p>

              <p style="margin:0;">
                We look forward to making your occasion unforgettable.<br />
                <strong style="color:#a46a2d;">— The {COMPANY_NAME} Team</strong>
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:35px 40px 50px;">
              <a href="{SITE_URL}"
                style="background:linear-gradient(135deg, #b22234 0%, #8b1e2b 50%, #c7933a 100%);
                       color:#fffdf5; padding:14px 40px; text-decoration:none; font-weight:700;
                       border-radius:50px; display:inline-block; font-size:16px;
                       box-shadow:0 4px 12px rgba(139,30,43,0.35);">
                Visit Our Website
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#faf5f1" style="padding:18px; text-align:center; color:#7b6a61; font-size:13px;">
              © {DATE} {COMPANY_NAME}. All Rights Reserved.<br/>
              <span style="color:#b22234;">Crafted with passion & flavor.</span>
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
                .replaceAll('{SITE_URL}', `https://${project?.subdomain}.xpertart.com`)
                .replaceAll('{DATE}', `${new Date().getFullYear()}`)
                .replaceAll("{HEADER_BG_IMAGE}", "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200&q=80")
                .replaceAll('{LOGO_URL}', `https://jaipurfoodcaterers.com/wp-content/themes/twentytwenty-child/assets/images/logo.png`);

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

    return (
        <div>

            {/* Hero Section */}
            <section
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setAnimate(true)}
            >
                {/* Hero Image */}
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                    <img
                        className="w-full h-full object-cover"
                        alt="Contact us hero banner"
                        src="https://c.animaapp.com/mhfz0577zdQtqk/img/image-73.png"
                    />

                    {/* Black Overlay */}
                    <div className="absolute inset-0 bg-black/70" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-start">
                        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
                            <div className="max-w-[500px] flex flex-col gap-4">
                                {/* Heading */}
                                <h1
                                    className={`font-['Roboto'] font-bold text-[32px] sm:text-[40px] md:text-[48px] text-white leading-tight transform transition-all duration-700 ${animate
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-10"
                                        }`}
                                >
                                    Contact Us
                                </h1>

                                {/* Subtext */}
                                <p
                                    className={`font-['Manrope'] font-medium text-white text-lg sm:text-xl md:text-2xl leading-normal transition-all duration-700 delay-200 ${animate
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-10"
                                        }`}
                                >
                                    Get in Touch for Exceptional Catering – Let&apos;s Make Your
                                    Event Unforgettable!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Details */}
            <section className="flex flex-wrap items-center justify-center gap-10 px-6 py-20 w-full bg-gradient-to-b from-white to-[#fff8f8]">
                {/* Email Card */}
                {project?.email && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <Card className="flex flex-col items-center justify-between w-[320px] sm:w-[340px] md:w-[360px] h-[300px] rounded-2xl border border-[#e4e4e4] bg-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform duration-300">
                            <CardContent className="flex flex-col items-center justify-center gap-5 py-8 px-4 text-center h-full">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
                                    <MailIcon className="w-8 h-8 text-red-600" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-semibold text-2xl text-gray-800">Email</h3>
                                <p className="font-medium text-gray-700 text-base text-center">
                                    {project.email}
                                </p>
                                <div className="w-12 h-[3px] bg-red-600 rounded-full mt-auto"></div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Mobile Card */}
                {project?.mobile_no && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <Card className="flex flex-col items-center justify-between w-[320px] sm:w-[340px] md:w-[360px] h-[300px] rounded-2xl border border-[#e4e4e4] bg-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform duration-300">
                            <CardContent className="flex flex-col items-center justify-center gap-5 py-8 px-4 text-center h-full">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
                                    <PhoneIcon className="w-8 h-8 text-red-600" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-semibold text-2xl text-gray-800">Mobile</h3>
                                <p className="font-medium text-gray-700 text-base text-center">
                                    {project.mobile_no}
                                    <br />
                                    {project.office_no}
                                </p>
                                <div className="w-12 h-[3px] bg-red-600 rounded-full mt-auto"></div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Address Card */}
                {project?.address1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <Card className="flex flex-col items-center justify-between w-[320px] sm:w-[340px] md:w-[360px] h-[300px] rounded-2xl border border-[#e4e4e4] bg-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform duration-300">
                            <CardContent className="flex flex-col items-center justify-center gap-5 py-8 px-4 text-center h-full">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
                                    <MapPinIcon className="w-8 h-8 text-red-600" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-semibold text-2xl text-gray-800">Address</h3>
                                <p className="font-medium text-gray-700 text-base text-center">
                                    {project.address1}
                                </p>
                                <div className="w-12 h-[3px] bg-red-600 rounded-full mt-auto"></div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </section>

            {/* Contact Form Section */}
            <section className="relative w-full flex flex-col items-center overflow-hidden">
                {/* Background Image */}
                <div className="relative w-full h-[600px] md:h-[650px]">
                    <img
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Contact background"
                        src="https://c.animaapp.com/mhfz0577zdQtqk/img/image-75.png"
                    />
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Contact form */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                        {/* Heading Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="mb-6"
                        >
                            <h3 className="font-[Satisfy] text-lg sm:text-xl text-white">
                                Contact Us
                            </h3>
                            <h2 className="font-roboto font-bold text-white text-3xl sm:text-4xl md:text-[40px] leading-snug">
                                Keep in Touch with Us
                            </h2>
                            <div className="mt-3 w-20 h-[3px] bg-[#c2302e] mx-auto rounded-full"></div>
                        </motion.div>

                        {/* Contact Form Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="w-full max-w-[850px] px-4"
                        >
                            <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit(onSubmit)}>
                                <Card className="w-full bg-white/95 backdrop-blur-sm rounded-[20px] shadow-lg">
                                    <CardContent className="flex flex-col gap-6 p-6 sm:p-10">
                                        {/* Input Fields Row 1 */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1 items-baseline">
                                                <Input
                                                    name="name"
                                                    className="w-full h-12 px-3 py-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-[#c2302e] transition-all text-sm"
                                                    placeholder="Full Name"
                                                    {...register("name")}
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 items-baseline">
                                                <Input
                                                    name="email"
                                                    className="w-full h-12 px-3 py-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-[#c2302e] transition-all text-sm"
                                                    placeholder="Email"
                                                    {...register("email")}
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Input Fields Row 2 */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1 items-baseline">
                                                <Input
                                                    name="phone"
                                                    type="text"
                                                    placeholder="Phone"
                                                    className="w-full h-12 px-3 py-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-[#c2302e] transition-all text-sm"
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
                                            </div>
                                            <div className="flex flex-col gap-1 items-baseline">
                                                <Input
                                                    placeholder="City"
                                                    className="w-full h-12 px-3 py-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-[#c2302e] transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 items-baseline">
                                            {/* Textarea */}
                                            <Textarea
                                                name="message"
                                                placeholder="Message"
                                                {...register("subject")}
                                                className="w-full h-[150px] px-3 py-3 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-[#c2302e] transition-all text-sm resize-none"
                                            />
                                            {errors.subject && (
                                                <p className="text-sm text-red-500">{errors.subject.message}</p>
                                            )}
                                        </div>


                                        {/* Submit Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                            viewport={{ once: true }}
                                            className="flex justify-center"
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto px-10 py-3 bg-[#c2302e] hover:bg-[#a02826] transition-all duration-300 rounded-full text-white font-semibold text-base shadow-md hover:shadow-lg">
                                                {isSubmitting ? (
                                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    "Submit"
                                                )}
                                            </Button>


                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

        </div>
    );
};