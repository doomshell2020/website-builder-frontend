"use client";

import React, { useEffect, useRef, useState } from "react";
import HeroSlider from "../slider/page";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { motion, useMotionValue, useInView, animate, Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnquiryAttributes } from "@/types/enquiry"
import { createEnquiry } from "@/services/enquiry.service";
import { enquirySchema } from "@/schemas/enquiry.schema";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { findGalleryBySlug } from "@/services/gallery.service";
type FormData = z.infer<typeof enquirySchema>;
interface DefaultHomeProps { project?: User; };

const statsData = [
    {
        image: "https://c.animaapp.com/mhd81w7aWvI44g/img/image-4-4.png",
        value: 1500,
        suffix: "+",
        label: "Plot Sold",
        delay: 0,
    },
    {
        image: "https://c.animaapp.com/mhd81w7aWvI44g/img/image-4-5.png",
        value: 12,
        suffix: "+",
        label: "Developed Townships",
        delay: 0.2,
    },
    {
        image: "https://c.animaapp.com/mhd81w7aWvI44g/img/image-4-6.png",
        value: 1000,
        suffix: "+",
        label: "Happy Clients",
        delay: 0.4,
    },
    {
        image: "https://c.animaapp.com/mhd81w7aWvI44g/img/image-4-7.png",
        value: 3,
        suffix: "L",
        label: "Total Area sq",
        delay: 0.6,
    },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const count = useMotionValue(0);
    const inView = useInView(ref, { once: true });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (inView) {
            const controls = animate(count, target, {
                duration: 2.5,
                ease: "easeOut",
                onUpdate: (latest) => {
                    setDisplayValue(Math.floor(latest));
                },
            });
            return () => controls.stop();
        }
    }, [inView, target, count]);

    return (
        <span ref={ref}>
            {displayValue.toLocaleString()}
            {suffix || ""}
        </span>
    );
};

export default function Home({ project }: DefaultHomeProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const fallbackImages = [
        "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-8.png",
        "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-9.png",
        "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-10.png",
        "https://navlokcolonizers.com/wp-content/uploads/2025/08/sliderBnr-2-1024x373.jpg",
        "https://navlokcolonizers.com/wp-content/uploads/2025/08/sliderBnr-3-1024x373.jpg",
        "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-13.png",
        "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-14.png",
        "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-15.png",
        "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-16.png",
    ];

    useEffect(() => {
        const fetchGalleryImages = async () => {
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
                    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
                    const safeBase = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";

                    if (Array.isArray(data.images)) {
                        imgs = data.images.map((p: string) =>
                            p.startsWith("http") ? p : `${safeBase}${p}`
                        );
                    } else if (typeof data.images === "string" && data.images.trim().length > 0) {
                        try {
                            const parsed = JSON.parse(data.images);
                            if (Array.isArray(parsed)) {
                                imgs = parsed.map((p: string) =>
                                    p.startsWith("http") ? p : `${safeBase}${p}`
                                );
                            } else {
                                imgs = [parsed.startsWith("http") ? parsed : `${safeBase}${parsed}`];
                            }
                        } catch {
                            imgs = [
                                data.images.startsWith("http")
                                    ? data.images
                                    : `${safeBase}${data.images}`,
                            ];
                        }
                    }
                }
                setImagePreviews(imgs.length > 0 ? imgs : fallbackImages);
            } catch (error) {
                console.error("❌ Error loading gallery:", error);
                setImagePreviews(fallbackImages);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryImages();
    }, [project]);


    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.15, },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

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
<body style="margin:0; padding:0; background-color:#f6f8fc; font-family:'Manrope', Arial, sans-serif; color:#111827;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f8fc" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" 
          style="border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Hero / Header -->
          <tr>
  <td align="center" bgcolor="#0B1739" 
    style="background:linear-gradient(135deg, #0B1739 0%, #1C2B57 100%); padding:40px 30px;">
    
    <!-- Logo Container with Transparent Background -->
    <div style="
      display:inline-block;
      background:rgba(255,255,255,0.12);
      backdrop-filter:blur(4px);
      border-radius:10px;
      padding:10px 20px;
      margin-bottom:20px;
    ">
      <picture>
        <source srcset="{LOGO_URL_WHITE}" media="(prefers-color-scheme: dark)">
        <img src="{LOGO_URL}" alt="{COMPANY_NAME}" 
          style="height:60px; display:block; margin:0 auto; object-fit:contain;" />
      </picture>
    </div>

    <!-- Heading -->
    <h1 style="color:#ffffff; font-size:26px; font-weight:700; margin:0;">
      Enquiry Received
    </h1>

    <p style="color:#CBD2E0; font-size:15px; margin-top:8px;">
      We’ve got your message — our team will reach out soon.
    </p>
  </td>
</tr>


          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px 40px; font-size:16px; line-height:1.6; color:#1f2937;">

              <p style="margin:0 0 20px; font-size:18px; font-weight:600; color:#111827;">
                Hi {NAME},
              </p>

              <p style="margin:0 0 20px; color:#374151;">
                Thank you for reaching out to <strong>{COMPANY_NAME}</strong>!  
                We’ve received your enquiry and our team will get back to you within 24–48 hours.
              </p>

              <div style="margin:25px 0; padding:18px 20px; background:#f9fafb; border-left:4px solid #6C4DFF; border-radius:8px;">
                <div style="font-weight:600; color:#0B1739; margin-bottom:6px;">Subject:</div>
                <div style="color:#374151; line-height:1.5;">{SUBJECT}</div>
              </div>

              <p style="margin:20px 0; color:#374151;">
                If your enquiry is urgent, please contact us directly at  
                <a href="tel:{COMPANY_PHONE}" style="color:#6C4DFF; font-weight:600; text-decoration:none;">{COMPANY_PHONE}</a>  
                or simply reply to this email.
              </p>

              <p style="margin:0; color:#374151;">
                We look forward to assisting you.<br />
                <strong style="color:#0B1739;">— The {COMPANY_NAME} Team</strong>
              </p>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td align="center" style="padding:30px 40px 50px;">
              <a href="{SITE_URL}" 
                style="background:linear-gradient(135deg, #6C4DFF 0%, #4B33C4 100%);
                       color:#ffffff; padding:14px 32px; text-decoration:none; font-weight:700;
                       border-radius:8px; display:inline-block; font-size:16px;">
                Visit Our Website
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#f6f8fc" style="padding:16px; text-align:center; color:#6b7280; font-size:12px;">
              &copy; {DATE} {COMPANY_NAME}. All rights reserved.
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
                .replaceAll('{SITE_URL}', `http://${project?.company_name}.webbuilder.local:3000`)
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
            const response: any = await createEnquiry(project?.company_name, payload);
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
            {/** Hero Section */}
            <HeroSlider company={project?.schema_name} slug={"home"} />

            {/** About Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-10 pt-[50px] pb-[50px] w-full"
            >
                {/* Left Image */}
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex justify-center flex-shrink-0"
                >
                    <img
                        className="w-[400px] object-cover rounded-xl"
                        alt="About Us"
                        src="https://c.animaapp.com/mhd81w7aWvI44g/img/frame-5-3.svg"
                    />
                </motion.div>

                {/* Right Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-col w-[609px] items-start justify-center gap-5 translate-y-[-1rem]"
                >
                    <div className="flex flex-col items-start gap-0.5 w-full">
                        <div className="inline-flex items-center justify-center gap-2.5">
                            <div className="font-medium text-[#00a4e5] w-fit mt-[-1.00px] [font-family:'Manrope',Helvetica] text-lg tracking-[0] leading-[normal]">
                                OUR STORY
                            </div>
                        </div>

                        <div className="flex w-full items-center justify-center gap-2.5">
                            <h2 className="flex-1 mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal] text-3xl font-bold">
                                Rooted in Values. Rising with Vision.
                            </h2>
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-center gap-2.5">
                        <p className="flex-1 mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-black text-lg text-justify tracking-[0] leading-[18px]">
                            <span className="font-bold leading-[27.8px]">
                                Navlok Colonizers Group: Building Tomorrow and Today.
                            </span>
                            <span className="font-light leading-[27.8px]">
                                {" "}
                                Navlok Colonizers Group stands as one of the most trusted and
                                visionary real estate developers in Jaipur. Our mission is to
                                redefine the way integrated townships are developed—by creating
                                vibrant, sustainable communities that seamlessly blend world-class
                                infrastructure with thoughtfully designed amenities.
                            </span>
                        </p>
                    </div>

                    <div className="flex w-full items-center justify-center gap-2.5">
                        <p className="flex-1 mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-black text-lg text-justify tracking-[0] leading-[18px]">
                            <span className="font-light leading-[20.4px]">At </span>
                            <span className="font-light leading-[27.8px]">
                                NavlokColonizers
                            </span>
                            <span className="font-light leading-[20.4px]">
                                , our work is driven by a deep commitment to enhancing the lives
                                of families. We focus on delivering economically planned,
                                high-quality real estate projects that not only meet the
                                aspirations of our customers but also uphold the highest standards
                                of environmental responsibility.
                            </span>
                        </p>
                    </div>

                    <Button
                        asChild
                        className="h-auto inline-flex items-center justify-center gap-2.5 px-4 py-2 bg-[#000216] rounded-[74px] hover:bg-[#000216]/90 transition-colors"
                    >
                        <Link href="/about">
                            <span className="w-fit mt-[-1.00px] [font-family:'Manrope',Helvetica] font-medium text-white text-base text-justify tracking-[0] leading-[24.7px] whitespace-nowrap">
                                Read More
                            </span>
                        </Link>
                    </Button>
                </motion.div>
            </motion.section>

            {/** Dashboard Calculation */}
            <section className="w-full bg-[#000216] py-[52px] px-6 sm:px-10 md:px-[60px] lg:px-[120px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-[31px] place-items-center">
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: stat.delay }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="w-full max-w-[276.75px]"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            >
                                <Card className="bg-[#f9f9f9] border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl h-64 flex items-center justify-center">
                                    <CardContent className="flex flex-col items-center gap-[18px] p-5 h-full">
                                        <div className="inline-flex flex-col items-center justify-center gap-2.5 p-0.5">
                                            <img
                                                className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] object-cover"
                                                alt={stat.label}
                                                src={stat.image}
                                            />
                                        </div>

                                        <h3 className="[font-family:'Manrope',Helvetica] font-semibold text-black text-3xl sm:text-4xl tracking-[0] leading-[normal]">
                                            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                        </h3>

                                        <p className="[font-family:'Inter',Helvetica] font-light text-black text-lg sm:text-xl tracking-[0] leading-[normal] text-center">
                                            {stat.label}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/** Gallery Section */}
            <section className="flex flex-col items-center justify-center gap-8 bg-gray-200 px-6 py-[60px] w-full">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center"
                >
                    <h3 className="font-semibold text-[#00a4e5] [font-family:'Manrope',Helvetica] text-lg">
                        OUR GALLERY
                    </h3>
                    <h2 className="[font-family:'Manrope',Helvetica] font-normal text-black text- xl sm:text-2xl">
                        Explore Our Work
                    </h2>
                </motion.header>

                {/* Gallery Grid */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-10 md:px-16 lg:px-20 w-full max-w-[1300px]"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {imagePreviews.map((image, index) => {
                        const handleDownload = async () => {
                            try {
                                const response = await fetch(image, { mode: "cors" });
                                const blob = await response.blob();
                                const blobUrl = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = blobUrl;
                                link.download = `image-${index + 1}.jpg`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(blobUrl);
                            } catch (err) {
                                console.error("Download failed:", err);
                                alert("Download failed. Please try again.");
                            }
                        };

                        // const handleShare = async () => {
                        //     if (navigator.share) {
                        //         try {
                        //             await navigator.share({
                        //                 title: `image-${index + 1}.jpg`,
                        //                 text: "Check out this image!",
                        //                 url: image,
                        //             });
                        //         } catch (err) {
                        //             console.error("Error sharing:", err);
                        //         }
                        //     } else {
                        //         await navigator.clipboard.writeText(image);
                        //         alert("Image link copied to clipboard!");
                        //     }
                        // };

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="relative group cursor-pointer overflow-hidden rounded-xl"
                            >
                                <img
                                    className="w-full h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={image}
                                    alt={`image-${index + 1}.jpg`}
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                    {/* Download Button */}
                                    <button
                                        onClick={handleDownload}
                                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                        aria-label="Download image"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="white"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                            />
                                        </svg>
                                    </button>

                                    {/* Share Button */}
                                    <button
                                        // onClick={handleShare}
                                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                        aria-label="Share image"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="white"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* View More Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <Button
                        asChild
                        className="px-5 py-2 bg-[#000216] rounded-[74px] hover:bg-[#000216]/90 transition-colors"
                    >
                        <Link href="/gallery">
                            <span className="[font-family:'Manrope',Helvetica] font-medium text-white text-base tracking-[0] leading-[24.7px] whitespace-nowrap">
                                View More
                            </span>
                        </Link>
                    </Button>
                </motion.div>
            </section>

            {/** Contact Section */}
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
};