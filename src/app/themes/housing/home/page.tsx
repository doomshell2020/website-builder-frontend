"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroSlider from "../slider/page";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
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

    const galleryImages = [
        {
            src: "https://c.animaapp.com/miu4qofhUHi324/img/image-3-11.png",
            alt: "Architecture project 1",
        },
        {
            src: "https://c.animaapp.com/miu4qofhUHi324/img/image-3-12.png",
            alt: "Architecture project 2",
        },
        {
            src: "https://c.animaapp.com/miu4qofhUHi324/img/image-3-13.png",
            alt: "Architecture project 3",
        },
        {
            src: "https://c.animaapp.com/miu4qofhUHi324/img/image-3-14.png",
            alt: "Architecture project 4",
        },
        {
            src: "https://c.animaapp.com/miu4qofhUHi324/img/image-3-15.png",
            alt: "Architecture project 5",
        },
        {
            src: "https://c.animaapp.com/miu4qofhUHi324/img/image-3-16.png",
            alt: "Architecture project 6",
        },
        {
            src: "https://c.animaapp.com/miu4qofhUHi324/img/image-3-17.png",
            alt: "Architecture project 7",
        },
        {
            src: "https://c.animaapp.com/miu4qofhUHi324/img/image-3-18.png",
            alt: "Architecture project 8",
        },
    ];

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
                .replaceAll('{SITE_URL}', `https://${project?.subdomain}.xpertart.com`)
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
            <section className="flex flex-col items-center gap-2.5 p-20 w-full bg-white">
                <div className="flex flex-wrap items-start justify-center gap-[78px] w-full">
                    <img
                        className="w-[588.5px] mt-[-44px] mb-[-8px] ml-[-12.5px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]"
                        alt="Img dot box"
                        src="https://c.animaapp.com/miu4qofhUHi324/img/img-dot-box-1.svg"
                    />

                    <div className="flex flex-col w-[681px] items-start gap-[22px] pt-[18px] pb-0 px-0 relative">
                        <div className="flex flex-col items-start w-full">
                            <div className="flex flex-col items-start justify-center gap-4 w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                                <div className="flex w-full items-center gap-2.5">
                                    <h2 className="w-fit mt-[-1px] font-manrope-34 font-[number:var(--manrope-34-font-weight)] text-[#141414] text-[length:var(--manrope-34-font-size)] tracking-[var(--manrope-34-letter-spacing)] leading-[var(--manrope-34-line-height)] [font-style:var(--manrope-34-font-style)]">
                                        Designing Spaces, Defining Futures
                                    </h2>
                                </div>
                            </div>

                            <div className="inline-flex absolute top-[-15px] left-0 items-center gap-2.5 opacity-0 animate-fade-in [--animation-delay:0ms]">
                                <div className="w-[647px] mt-[-1px] font-manrope-66 font-[number:var(--manrope-66-font-weight)] text-[#00a4e521] text-[length:var(--manrope-66-font-size)] tracking-[var(--manrope-66-letter-spacing)] leading-[var(--manrope-66-line-height)] [font-style:var(--manrope-66-font-style)]">
                                    OUR STORY
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2.5 pl-0 pr-2.5 py-0 w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                            <p className="flex-1 font-poppinsregular-22 font-[number:var(--poppinsregular-22-font-weight)] text-[#141414] text-[length:var(--poppinsregular-22-font-size)] text-justify tracking-[var(--poppinsregular-22-letter-spacing)] leading-[var(--poppinsregular-22-line-height)] [font-style:var(--poppinsregular-22-font-style)]">
                                Founded on July 28, 2025, NAVVISTAR INFRA PVT. LTD. is a visionary
                                new construction company built on ambition, innovation, and a
                                commitment to excellence. We are more than just builders — we are
                                forward-thinkers with a clear mission to shape the future of
                                construction through smart design, quality craftsmanship, and
                                sustainable practices.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2.5 pl-0 pr-2.5 py-0 w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
                            <p className="flex-1 font-poppinsregular-22 font-[number:var(--poppinsregular-22-font-weight)] text-[#141414] text-[length:var(--poppinsregular-22-font-size)] text-justify tracking-[var(--poppinsregular-22-letter-spacing)] leading-[var(--poppinsregular-22-line-height)] [font-style:var(--poppinsregular-22-font-style)]">
                                Driven by a high vision, we aim to set new standards in the
                                industry by delivering modern, efficient, and long-lasting
                                structures that meet the evolving needs of our clients and
                                communities. Our team combines fresh ideas with technical
                                expertise to bring bold concepts to life — safely, on time, and
                                within budget.
                            </p>
                        </div>

                        <Button
                            onClick={() => router.push("/about")}
                            className="h-auto gap-2.5 px-6 py-3 bg-[#1b1b1b] hover:bg-[#1b1b1b]/90 transition-colors translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
                            <span className="w-fit mt-[-1px] font-poppins-22 font-[number:var(--poppins-22-font-weight)] text-white text-[length:var(--poppins-22-font-size)] tracking-[var(--poppins-22-letter-spacing)] leading-[var(--poppins-22-line-height)] [font-style:var(--poppins-22-font-style)]">
                                Explore More
                            </span>
                        </Button>
                    </div>
                </div>
            </section>

            {/** Gallery Section */}
            <section className="flex flex-col items-center justify-center gap-[38px] px-20 py-[54px] w-full bg-[#f0f0f0]">
                <header className="flex flex-col items-center justify-center gap-6 w-full relative">
                    <div className="flex justify-center w-full items-center relative z-10 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                        <h2 className="font-manrope-38 font-[number:var(--manrope-38-font-weight)] text-[#141414] text-[length:var(--manrope-38-font-size)] tracking-[var(--manrope-38-letter-spacing)] leading-[var(--manrope-38-line-height)] [font-style:var(--manrope-38-font-style)]">
                            Explore Our Work
                        </h2>
                    </div>

                    <div className="absolute top-[-60%] left-[37%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 animate-fade-in [--animation-delay:0ms]">
                        <p className="font-manrope-66 font-[number:var(--manrope-66-font-weight)] text-[#00a4e521] text-[length:var(--manrope-66-font-size)] text-center tracking-[var(--manrope-66-letter-spacing)] leading-[var(--manrope-66-line-height)] [font-style:var(--manrope-66-font-style)] whitespace-nowrap">
                            OUR GALLERY
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                    {galleryImages.map((image, index) => (
                        <Card
                            key={index}
                            className="border-[#141414] bg-white transition-transform hover:scale-105 duration-300"
                        >
                            <CardContent className="p-1.5">
                                <img
                                    className="w-full h-[194.33px] object-cover"
                                    alt={image.alt}
                                    src={image.src}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button
                    onClick={() => router.push("/gallery")}
                    className="h-auto gap-2.5 px-6 py-3 bg-[#1b1b1b] hover:bg-[#1b1b1b]/90 transition-colors translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
                    <span className="w-fit mt-[-1px] font-poppins-22 font-[number:var(--poppins-22-font-weight)] text-white text-[length:var(--poppins-22-font-size)] tracking-[var(--poppins-22-letter-spacing)] leading-[var(--poppins-22-line-height)] [font-style:var(--poppins-22-font-style)]">
                        Explore More
                    </span>
                </Button>
            </section>

            {/** Contact Section */}
            <section className="flex flex-col items-center gap-2.5 px-20 py-[62px] w-full bg-white">
                <div className="flex flex-wrap items-center justify-center gap-[34px] w-full bg-white shadow-[1px_-1px_6px_#00000059]">
                    <div className="flex w-[393px] h-[611px] items-center justify-center gap-2.5 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                        <img
                            className="flex-1 self-stretch object-cover"
                            alt="Contact support"
                            src="https://c.animaapp.com/miu4qofhUHi324/img/image-36-1.png"
                        />
                    </div>

                    <div className="flex flex-col w-[853px] items-center justify-center gap-[22px] pl-0 pr-5 py-5 bg-white translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                        <div className="flex items-center gap-2.5 self-stretch w-full">
                            <h2 className="w-fit mt-[-1.00px] font-manrope-34 font-[number:var(--manrope-34-font-weight)] text-[#141414] text-[length:var(--manrope-34-font-size)] text-justify tracking-[var(--manrope-34-letter-spacing)] leading-[var(--manrope-34-line-height)] [font-style:var(--manrope-34-font-style)]">
                                Let&apos;s Talk
                            </h2>
                        </div>

                        <div className="flex items-center gap-2.5 self-stretch w-full">
                            <p className="flex-1 mt-[-1.00px] font-poppinsregular-20 font-[number:var(--poppinsregular-20-font-weight)] text-[#141414] text-[length:var(--poppinsregular-20-font-size)] text-justify tracking-[var(--poppinsregular-20-letter-spacing)] leading-[var(--poppinsregular-20-line-height)] [font-style:var(--poppinsregular-20-font-style)]">
                                Our support team is here to guide you—no matter how big or small
                                your concern.
                            </p>
                        </div>

                        <form className="flex flex-col items-end justify-end gap-7 self-stretch w-full">
                            <div className="flex items-center justify-center gap-8 self-stretch w-full">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="First Name"
                                        className="h-auto pl-3.5 pr-0 py-4 rounded-sm border border-solid border-[#141414] font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-[#9a9393] text-[length:var(--interregular-20-font-size)] text-justify tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] placeholder:text-[#9a9393]"
                                    />
                                </div>

                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Last Name"
                                        className="h-auto pl-3.5 pr-0 py-4 rounded-sm border border-solid border-[#141414] font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-[#9a9393] text-[length:var(--interregular-20-font-size)] text-justify tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] placeholder:text-[#9a9393]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-8 self-stretch w-full">
                                <div className="flex-1">
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        className="h-auto pl-3.5 pr-0 py-4 rounded-sm border border-solid border-[#141414] font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-[#9a9393] text-[length:var(--interregular-20-font-size)] text-justify tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] placeholder:text-[#9a9393]"
                                    />
                                </div>

                                <div className="flex-1">
                                    <Input
                                        type="tel"
                                        placeholder="Phone"
                                        className="h-auto pl-3.5 pr-0 py-4 rounded-sm border border-solid border-[#141414] font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-[#9a9393] text-[length:var(--interregular-20-font-size)] text-justify tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] placeholder:text-[#9a9393]"
                                    />
                                </div>
                            </div>

                            <div className="self-stretch w-full">
                                <Textarea
                                    placeholder="Message"
                                    className="h-[199px] pl-3.5 pr-0 py-4 rounded-sm border border-solid border-[#141414] font-interregular-20 font-[number:var(--interregular-20-font-weight)] text-[#9a9393] text-[length:var(--interregular-20-font-size)] text-justify tracking-[var(--interregular-20-letter-spacing)] leading-[var(--interregular-20-line-height)] [font-style:var(--interregular-20-font-style)] placeholder:text-[#9a9393] resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="h-auto px-[26px] py-4 self-stretch w-full bg-[#201667] hover:bg-[#201667]/90 transition-colors font-poppinsmedium-20 font-[number:var(--poppinsmedium-20-font-weight)] text-white text-[length:var(--poppinsmedium-20-font-size)] text-justify tracking-[var(--poppinsmedium-20-letter-spacing)] leading-[var(--poppinsmedium-20-line-height)] [font-style:var(--poppinsmedium-20-font-style)]"
                            >
                                Submit
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    );
};
