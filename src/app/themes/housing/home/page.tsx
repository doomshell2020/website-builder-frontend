"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroSlider from "../slider/page";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { findGalleryBySlug } from "@/services/gallery.service";
import { EnquiryAttributes } from "@/types/enquiry"
import { createEnquiry } from "@/services/enquiry.service";
import { enquirySchema } from "@/schemas/enquiry.schema";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { motion, Variants } from "framer-motion";
import { User } from "@/types/user";
interface DefaultHomeProps { project?: User };
type FormData = z.infer<typeof enquirySchema>;

export default function HousingHome({ project }: DefaultHomeProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const fallbackImages = [
        "/assest/image/gallery-7.jpg",
        "/assest/image/gallery-6.jpg",
        "/assest/image/gallery-8.jpg",
        "/assest/image/gallery-1.jpg",
        "/assest/image/gallery-3.jpg",
        "/assest/image/gallery-2.jpg",
        "/assest/image/gallery-5.jpg",
        "/assest/image/gallery-4.jpg",
    ];

    useEffect(() => {
        const fetchGalleryImages = async () => {
            // If no company name, fallback
            if (!project?.schema_name) {
                setImagePreviews(fallbackImages);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res: any = await findGalleryBySlug(project.schema_name, "gallery");
                const data = res?.result || res;

                let imgs: string[] = [];

                if (data?.images) {
                    // ✅ Handle array of images
                    if (Array.isArray(data.images)) {
                        imgs = data.images.map((p: string) =>
                            p.startsWith("http")
                                ? p
                                : `${process.env.NEXT_PUBLIC_IMAGE_URL}${p}`
                        );
                    }
                    // ✅ Handle stringified JSON or single image string
                    else if (typeof data.images === "string" && data.images.trim().length > 0) {
                        try {
                            const parsed = JSON.parse(data.images);
                            if (Array.isArray(parsed)) {
                                imgs = parsed.map((p: string) =>
                                    p.startsWith("http")
                                        ? p
                                        : `${process.env.NEXT_PUBLIC_IMAGE_URL}${p}`
                                );
                            } else {
                                imgs = [
                                    parsed.startsWith("http")
                                        ? parsed
                                        : `${process.env.NEXT_PUBLIC_IMAGE_URL}${parsed}`,
                                ];
                            }
                        } catch {
                            // If not JSON, treat as plain path string
                            imgs = [
                                data.images.startsWith("http")
                                    ? data.images
                                    : `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.images}`,
                            ];
                        }
                    }
                }

                // ✅ If nothing came, use fallback images
                setImagePreviews(imgs.length > 0 ? imgs : fallbackImages);
            } catch (error) {
                // ✅ Friendly error fallback
                // SwalError({ title: "Error", message: "Failed to load Gallery data." });
                setImagePreviews(fallbackImages);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryImages();
    }, [project]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(enquirySchema) as any,
    });

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.15, // delay between children
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

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
           
           <body style="margin:0; padding:0; background-color:#f7f6f3; font-family:'Manrope', Arial, sans-serif; color:#1a1a1a;">
           
             <!-- Background Wrapper -->
             <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f7f6f3" style="padding:40px 0;">
               <tr>
                 <td align="center">
           
                   <!-- Main Container -->
                   <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff"
                          style="border-radius:16px; overflow:hidden; box-shadow:0 6px 25px rgba(0,0,0,0.07);">
           
                     <!-- Hero Section -->
                     <tr>
                       <td align="center" background="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=80"
                           style="background-size:cover; background-position:center; padding:60px 20px; text-align:center; color:#ffffff;">
                         <div style="background-color:rgba(30, 41, 59, 0.85); border-radius:12px; padding:30px 20px; display:inline-block;">
                           <img src="{LOGO_URL}" alt="{COMPANY_NAME}" style="max-height:65px; margin-bottom:18px;" />
                           <h1 style="margin:0; font-size:24px; font-weight:700; color:#ffffff;">
                             Your Enquiry Has Been Received
                           </h1>
                           <p style="margin:10px 0 0; font-size:15px; color:#dbeafe;">
                             Thank you for contacting {COMPANY_NAME}
                           </p>
                         </div>
                       </td>
                     </tr>
           
                     <!-- Body Section -->
                     <tr>
                       <td style="padding:40px; font-size:16px; line-height:1.7; color:#333;">
                         <p style="margin:0 0 15px 0; font-size:20px; font-weight:700; color:#1f2937;">
                           Dear {NAME},
                         </p>
           
                         <p style="margin:0 0 16px;">
                           We appreciate your interest in <strong>{COMPANY_NAME}</strong> and our housing projects.  
                           Your enquiry has been successfully received. Our property consultant will contact you within 
                           <strong>24–48 hours</strong> to guide you through available plots, flats, or investment opportunities.
                         </p>
           
                         <!-- Enquiry Summary -->
                         <div style="margin:25px 0; background-color:#faf8f6; border-left:4px solid #b45309; border-radius:8px; padding:16px 20px;">
                           <p style="margin:0 0 6px; font-weight:600; color:#78350f;">Enquiry Details:</p>
                           <p style="margin:0; color:#333;">{SUBJECT}</p>
                         </div>
           
                         <p style="margin:0 0 18px;">
                           For immediate assistance, please call us at 
                           <a href="tel:{COMPANY_PHONE}" style="color:#b45309; font-weight:600; text-decoration:none;">
                             {COMPANY_PHONE}
                           </a> 
                           or reply directly to this email.
                         </p>
           
                         <p style="margin:0;">
                           Thank you for choosing <strong>{COMPANY_NAME}</strong> — we’re delighted to help you find your dream home.<br/>
                           — The {COMPANY_NAME} Team
                         </p>
                       </td>
                     </tr>
           
                     <!-- CTA Section -->
                     <tr>
                       <td align="center" style="padding:10px 40px 50px;">
                         <a href="{SITE_URL}"
                            style="background:linear-gradient(135deg,#b45309,#f59e0b);
                                   color:#ffffff; text-decoration:none; padding:14px 36px;
                                   border-radius:8px; font-weight:700; font-size:16px;
                                   letter-spacing:0.3px; display:inline-block;">
                           Explore Properties
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
                       <td align="center" style="background-color:#1f2937; padding:25px; color:#f9fafb; font-size:13px;">
                         <p style="margin:0 0 8px;">© {DATE} {COMPANY_NAME}. All rights reserved.</p>
                         <p style="margin:0;">
                           <a href="{SITE_URL}" style="color:#f59e0b; text-decoration:none;">Visit Our Site</a> | 
                           <a href="mailto:{COMPANY_EMAIL}" style="color:#f59e0b; text-decoration:none;">Contact Support</a>
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
                .replaceAll('{LOGO_URL}', `https://navvistarinfra.com/wp-content/uploads/2025/08/logo-1.png`);

            const payload: EnquiryAttributes = {
                name: `${data.name} ${data.name2}`.trim(),
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
            {/** Hero Section */}
            <HeroSlider company={project?.schema_name} slug={"home"} />

            {/** About Section */}
            <section className="flex flex-col items-center relative justify-center px-6 md:px-12 lg:px-20 py-20 bg-white rounded-t-[40px] overflow-hidden">
                {/* Decorative Dots */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 md:left-[33%]">
                    <img
                        className="w-28 md:w-40 lg:w-40 object-contain opacity-80"
                        alt="Decorative Dots"
                        src="https://c.animaapp.com/mghk811dbdG4xS/img/dots-1-1.png"
                    />
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 relative w-full max-w-[1200px]">
                    {/* Left Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -80 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="flex justify-center flex-shrink-0"
                    >
                        <img
                            className="w-64 sm:w-80 md:w-[400px] lg:w-[400px] xl:w-[480px] object-cover rounded-xl"
                            alt="About Us"
                            src="https://c.animaapp.com/mghk811dbdG4xS/img/image-34-1.png"
                        />
                    </motion.div>

                    {/* Right Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="relative flex flex-col gap-6 text-center lg:text-left max-w-2xl"
                    >
                        {/* Background "OUR STORY" text */}
                        <h1 className="absolute -top-6 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 text-6xl font-poppins font-bold text-[#E6F4FF] opacity-70 select-none pointer-events-none">
                            OUR STORY
                        </h1>

                        {/* Foreground main heading */}
                        <h2 className="relative font-poppins font-bold text-black text-2xl sm:text-3xl lg:text-3xl">
                            Designing Spaces, Defining Futures
                        </h2>

                        <p className="text-black text-base sm:text-lg">
                            Founded on <span className="font-semibold">July 28, 2025</span>,
                            NAVVISTAR INFRA PVT. LTD. is a visionary construction company built
                            on ambition, innovation, and a commitment to excellence. We are more
                            than just builders — we are forward-thinkers with a clear mission to
                            shape the future of construction through smart design, quality
                            craftsmanship, and sustainable practices.
                        </p>

                        <p className="text-black text-base sm:text-lg">
                            Driven by a high vision, we aim to set new standards in the industry
                            by delivering modern, efficient, and long-lasting structures that
                            meet the evolving needs of our clients and communities. Our team
                            combines fresh ideas with technical expertise to bring bold concepts
                            to life — safely, on time, and within budget.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href="/about"
                                className="relative mt-4 max-w-[180px] w-full inline-flex items-center justify-center bg-[#141414] text-white text-lg font-medium px-4 py-2 rounded-md overflow-hidden transition-all duration-300 group"
                            >
                                <span className="relative z-10">Explore More</span>
                                <span className="absolute left-0 top-0 h-full w-0 bg-[#1199d4] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/** Gallery Section */}
            <section>
                <motion.div
                    className="flex flex-col items-center justify-center gap-10 p-10 md:p-16 lg:p-20 bg-gray-100 w-full"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }} // triggers when 20% is visible
                >
                    {/* Section Title */}
                    <motion.div
                        className="relative text-center w-full"
                        variants={itemVariants}
                    >
                        <h1 className="absolute inset-0 flex items-center justify-center text-6xl -top-12 text-[#00a4e520] uppercase pointer-events-none select-none">
                            OUR GALLERY
                        </h1>
                        <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-black font-poppins">
                            Explore Our Work
                        </h2>
                    </motion.div>

                    {/* Image Grid */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl"
                        variants={containerVariants}
                    >
                        {imagePreviews.slice(0, 8).map((src, index) => (
                            <motion.div
                                key={index}
                                className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                                variants={itemVariants}
                            >
                                <img
                                    src={src}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-48 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                                    loading="lazy"
                                />
                            </motion.div>
                        ))}

                    </motion.div>

                    {/* Explore Button */}
                    <Link href="/gallery">
                        <motion.button
                            variants={itemVariants}
                            className="relative mt-4 max-w-[180px] w-full inline-flex items-center justify-center bg-[#141414] text-white text-lg font-medium px-4 py-2 rounded-md overflow-hidden transition-all duration-300 group"
                        >
                            <span className="relative z-10">Explore More</span>
                            <span className="absolute left-0 top-0 h-full w-0 bg-[#1199d4] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/** Contact Section */}
            <section>
                <div className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]">
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
                                <div className="space-y-1 text-center lg:text-left">
                                    <h2 className="text-[28px] text-gray-900 font-poppins">
                                        Let’s Talk
                                    </h2>
                                    <p className="text-base md:text-[16px] text-gray-800 font-semibold">
                                        Our support team is here to guide you—no matter how big or small your concern.
                                    </p>
                                </div>

                                {/* Form */}
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                                    {/* Row 1 */}
                                    <Input
                                        name="name"
                                        className="bg-white-500"
                                        placeholder="First Name"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}

                                    {/* Row 2 */}
                                    <Input
                                        name="name2"
                                        className="bg-white-500"
                                        placeholder="Last Name"
                                        {...register("name2")}
                                    />

                                    {/* Row 3 */}
                                    <Input
                                        name="email"
                                        className="bg-white-500"
                                        placeholder="Email"
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}

                                    {/* Row 4 */}
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

                                    {/* Row 5 */}
                                    <div className="md:col-span-2">
                                        <Textarea
                                            name="message"
                                            placeholder="Message"
                                            {...register("subject")}
                                            className="resize-none"
                                        />
                                        {errors.subject && (
                                            <p className="text-sm text-red-500">{errors.subject.message}</p>
                                        )}

                                    </div>

                                    {/* Submit Button */}
                                    <div className="md:col-span-2">
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            variants={itemVariants}
                                            className="relative mt-4 w-full inline-flex items-center justify-center bg-[#141414] text-white text-lg font-medium px-6 py-2 rounded-md overflow-hidden transition-all duration-300 group disabled:opacity-60"
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
                                    </div>

                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
