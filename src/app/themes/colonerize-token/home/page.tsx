"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Variants } from "framer-motion";
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
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
    {
        image: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5.png",
        title: "Build Your Dream Home",
        subtitle: "Premium Plots in Jaipur's Most Sought-After Locations",
    },
    {
        image: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5-1.png",
        title: "Integrated Townships",
        subtitle: "Modern Living with World-Class Amenities",
    },
    {
        image: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5-2.png",
        title: "Trusted Developer",
        subtitle: "Over 1,500+ Plots Sold and 1,000+ Happy Families",
    },
];

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
                .replaceAll('{SITE_URL}', `https://${project?.subdomain}.xpertart.com`)
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

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);

        const autoplay = setInterval(() => {
            emblaApi.scrollNext();
        }, 5000);

        return () => {
            clearInterval(autoplay);
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    const galleryImages = [
        {
            src: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5.png",
            alt: "Gallery image 1",
        },
        {
            src: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5-1.png",
            alt: "Gallery image 2",
        },
        {
            src: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5-2.png",
            alt: "Gallery image 3",
        },
        {
            src: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5-3.png",
            alt: "Gallery image 4",
        },
        {
            src: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5-4.png",
            alt: "Gallery image 5",
        },
        {
            src: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5-5.png",
            alt: "Gallery image 6",
        },
        {
            src: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5-6.png",
            alt: "Gallery image 7",
        },
        {
            src: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-5-7.png",
            alt: "Gallery image 8",
        },
    ];

    const contactInfoData = [
        {
            icon: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-7.png",
            title: "Phone",
            content: "9414520171",
        },
        {
            icon: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-10.png",
            title: "Email",
            content: "contact@navlokcolonizers.com",
        },
        {
            icon: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-11.png",
            title: "Address",
            content: "75,76,77 F Patarkar colony Mansarover, Jaipur 302017",
        },
    ];

    const statisticsData = [
        {
            image: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-4.png",
            number: "1,500+",
            label: "Plot Sold",
        },
        {
            image: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-4-1.png",
            number: "12+",
            label: "Developed Townships",
        },
        {
            image: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-4-2.png",
            number: "1,000+",
            label: "Happy Clients",
        },
        {
            image: "https://c.animaapp.com/mijuqzb08ywwmN/img/image-4-3.png",
            number: "3+",
            label: "Total Area sq",
        },
    ];

    return (
        <div>

            {/** Slider Section */}
            <section className="relative w-full overflow-hidden bg-bgToken">
                <div className="embla" ref={emblaRef}>
                    <div className="embla__container flex">
                        {heroSlides.map((slide, index) => (
                            <div
                                key={index}
                                className="embla__slide relative min-w-0 flex-[0_0_100%]"
                            >
                                <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-bgToken/80 to-transparent" />

                                    <div className="relative h-full flex items-center px-4 sm:px-8 md:px-16 lg:px-[120px]">
                                        <div className="max-w-3xl space-y-6 translate-y-[-1rem] animate-fade-in opacity-0">
                                            <h1 className="font-heading-2xl font-[number:var(--heading-2xl-font-weight)] text-primary-white text-4xl md:text-5xl lg:text-6xl tracking-[var(--heading-2xl-letter-spacing)] leading-tight [font-style:var(--heading-2xl-font-style)]">
                                                {slide.title}
                                            </h1>
                                            <p className="font-text-xl font-[number:var(--text-xl-font-weight)] text-primary-white text-lg md:text-xl lg:text-2xl tracking-[var(--text-xl-letter-spacing)] leading-relaxed [font-style:var(--text-xl-font-style)] opacity-0 animate-fade-in [--animation-delay:200ms]">
                                                {slide.subtitle}
                                            </p>
                                            <div className="flex gap-4 opacity-0 animate-fade-in [--animation-delay:400ms]">
                                                <Button className="h-auto gap-2.5 px-8 py-4 bg-blue-color rounded-[54px] hover:bg-blue-color/90 transition-colors">
                                                    <span className="font-text-md font-[number:var(--text-md-font-weight)] text-primary-white text-[length:var(--text-md-font-size)] tracking-[var(--text-md-letter-spacing)] leading-[var(--text-md-line-height)] [font-style:var(--text-md-font-style)]">
                                                        Explore Projects
                                                    </span>
                                                </Button>
                                                <Button className="h-auto gap-2.5 px-8 py-4 bg-transparent border-2 border-primary-white rounded-[54px] hover:bg-primary-white/10 transition-colors">
                                                    <span className="font-text-md font-[number:var(--text-md-font-weight)] text-primary-white text-[length:var(--text-md-font-size)] tracking-[var(--text-md-letter-spacing)] leading-[var(--text-md-line-height)] [font-style:var(--text-md-font-style)]">
                                                        Contact Us
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={scrollPrev}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-primary-white/20 backdrop-blur-sm hover:bg-primary-white/30 transition-colors flex items-center justify-center group"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 text-primary-white group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={scrollNext}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-primary-white/20 backdrop-blur-sm hover:bg-primary-white/30 transition-colors flex items-center justify-center group"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 text-primary-white group-hover:scale-110 transition-transform" />
                </button>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === selectedIndex
                                ? "bg-blue-color w-8"
                                : "bg-primary-white/50 hover:bg-primary-white/70"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/** About Section */}
            <section className="flex flex-wrap w-full items-start justify-center gap-[89px] pt-[50px] pb-[140px] px-[121px] relative">
                <img
                    className="relative w-full max-w-[503.5px] mb-[-95.10px] translate-y-[-1rem] animate-fade-in opacity-0"
                    alt="About img"
                    src="https://c.animaapp.com/mijuqzb08ywwmN/img/about-img.svg"
                />

                <div className="flex flex-col w-full max-w-[609px] items-start justify-center gap-4 relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                    <div className="flex items-start gap-0.5 self-stretch w-full flex-col relative">
                        <div className="inline-flex items-center justify-center gap-2.5 relative">
                            <p className="relative w-fit mt-[-1.00px] font-text-lg font-[number:var(--text-lg-font-weight)] text-blue-color text-[length:var(--text-lg-font-size)] tracking-[var(--text-lg-letter-spacing)] leading-[var(--text-lg-line-height)] [font-style:var(--text-lg-font-style)]">
                                OUR STORY
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2.5 relative self-stretch w-full">
                            <h2 className="relative flex-1 mt-[-1.00px] font-heading-2xl font-[number:var(--heading-2xl-font-weight)] text-primary-black text-[length:var(--heading-2xl-font-size)] tracking-[var(--heading-2xl-letter-spacing)] leading-[var(--heading-2xl-line-height)] [font-style:var(--heading-2xl-font-style)]">
                                Rooted in Values. Rising with Vision.
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2.5 relative self-stretch w-full">
                        <p className="relative flex-1 mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-primary-black text-xl text-justify tracking-[0] leading-5">
                            <span className="font-bold text-black">
                                Navlok Colonizers Group: Building Tomorrow and Today.
                            </span>

                            <span className="font-bold text-black">&nbsp;</span>

                            <span className="font-[number:var(--text-lite-lg-font-weight)] text-black leading-[var(--text-lite-lg-line-height)] font-text-lite-lg [font-style:var(--text-lite-lg-font-style)] tracking-[var(--text-lite-lg-letter-spacing)] text-[length:var(--text-lite-lg-font-size)]">
                                Navlok Colonizers Group stands as one of the most trusted and
                                visionary real estate developers in Jaipur. Our mission is to
                                redefine the way integrated townships are developed—by creating
                                vibrant, sustainable communities that seamlessly blend world-class
                                infrastructure with thoughtfully designed amenities.
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2.5 relative self-stretch w-full">
                        <p className="relative flex-1 mt-[-1.00px] font-text-lite-lg font-[number:var(--text-lite-lg-font-weight)] text-primary-black text-[length:var(--text-lite-lg-font-size)] text-justify tracking-[var(--text-lite-lg-letter-spacing)] leading-[var(--text-lite-lg-line-height)] [font-style:var(--text-lite-lg-font-style)]">
                            At NavlokColonizers, our work is driven by a deep commitment to
                            enhancing the lives of families. We focus on delivering economically
                            planned, high-quality real estate projects that not only meet the
                            aspirations of our customers but also uphold the highest standards
                            of environmental responsibility.
                        </p>
                    </div>

                    <Button className="h-auto gap-2.5 px-[30px] py-3.5 bg-gray-color rounded-[54px] hover:bg-gray-color/90 transition-colors">
                        <span className="relative w-fit mt-[-1.00px] font-text-md font-[number:var(--text-md-font-weight)] text-primary-white text-[length:var(--text-md-font-size)] text-justify tracking-[var(--text-md-letter-spacing)] leading-[var(--text-md-line-height)] [font-style:var(--text-md-font-style)]">
                            Read More
                        </span>
                    </Button>
                </div>
            </section>

            {/** Dashboard Calculation */}
            <section className="w-full bg-bgToken px-4 py-[52px] md:px-[120px]">
                <div className="flex flex-wrap items-start justify-center gap-[30px]">
                    {statisticsData.map((stat, index) => (
                        <Card
                            key={index}
                            className="w-full max-w-[277.5px] bg-white border-0 shadow-none translate-y-[-1rem] animate-fade-in opacity-0"
                            style={
                                { "--animation-delay": `${index * 200}ms` } as React.CSSProperties
                            }
                        >
                            <CardContent className="flex flex-col items-center gap-3 px-0 py-[34px]">
                                <div className="flex flex-col items-start justify-center">
                                    <img
                                        className="w-[92px] h-[92px] object-cover"
                                        alt={stat.label}
                                        src={stat.image}
                                    />
                                </div>

                                <div className="flex flex-col items-center gap-2.5 w-full">
                                    <div className="flex items-center justify-center">
                                        <h3 className="font-text-4xl font-[number:var(--text-4xl-font-weight)] text-bgToken text-[length:var(--text-4xl-font-size)] tracking-[var(--text-4xl-letter-spacing)] leading-[var(--text-4xl-line-height)] [font-style:var(--text-4xl-font-style)]">
                                            {stat.number}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-center w-full">
                                        <p className="font-text-xl font-[number:var(--text-xl-font-weight)] text-gray-color-300 text-[length:var(--text-xl-font-size)] text-center tracking-[var(--text-xl-letter-spacing)] leading-[var(--text-xl-line-height)] [font-style:var(--text-xl-font-style)]">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/** Gallery Section */}
            <section className="flex flex-col items-center gap-[26px] px-0 py-[34px] w-full">
                <header className="flex flex-col items-center pt-[26px] pb-0 px-0 w-full translate-y-[-1rem] animate-fade-in opacity-0">
                    <div className="inline-flex items-center justify-center gap-2.5">
                        <h3 className="w-fit mt-[-1.00px] font-text-lg font-[number:var(--text-lg-font-weight)] text-blue-color text-[length:var(--text-lg-font-size)] text-center tracking-[var(--text-lg-letter-spacing)] leading-[var(--text-lg-line-height)] [font-style:var(--text-lg-font-style)]">
                            OUR GALLERY
                        </h3>
                    </div>

                    <div className="inline-flex items-center justify-center gap-2.5">
                        <h2 className="w-fit mt-[-1.00px] font-text-3xl font-[number:var(--text-3xl-font-weight)] text-primary-black text-[length:var(--text-3xl-font-size)] text-center tracking-[var(--text-3xl-letter-spacing)] leading-[var(--text-3xl-line-height)] [font-style:var(--text-3xl-font-style)]">
                            Explore Our Work
                        </h2>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-4 sm:px-8 md:px-16 lg:px-[120px] w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-start gap-2.5 w-full max-w-[291px] mx-auto transition-transform hover:scale-105 duration-300"
                        >
                            <div className="flex flex-col items-start gap-2.5 bg-primary-white w-full overflow-hidden rounded-sm">
                                <img
                                    className="w-full h-[254.73px] object-cover"
                                    alt={image.alt}
                                    src={image.src}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <Button className="h-auto gap-2.5 px-[30px] py-3.5 bg-gray-color rounded-[54px] hover:bg-gray-color/90 transition-colors translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                    <span className="w-fit mt-[-1.00px] font-text-md font-[number:var(--text-md-font-weight)] text-primary-white text-[length:var(--text-md-font-size)] tracking-[var(--text-md-letter-spacing)] leading-[var(--text-md-line-height)] [font-style:var(--text-md-font-style)]">
                        View More
                    </span>
                </Button>
            </section>

            {/** Contact Section */}
            <section className="flex w-full items-center justify-center gap-3 px-4 md:px-[120px] py-[52px] bg-primary-white">
                <div className="flex flex-col md:flex-row w-full max-w-[1440px] items-start justify-center gap-3">
                    <div className="flex flex-col w-full md:w-[675px] items-start justify-center gap-6 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                        <header className="flex flex-col items-start gap-3.5 w-full">
                            <div className="inline-flex items-center justify-center gap-2.5">
                                <h2 className="w-fit mt-[-1.00px] font-heading-2xl font-[number:var(--heading-2xl-font-weight)] text-primary-black text-[length:var(--heading-2xl-font-size)] tracking-[var(--heading-2xl-letter-spacing)] leading-[var(--heading-2xl-line-height)] [font-style:var(--heading-2xl-font-style)]">
                                    Let&apos;s Start a Conversation
                                </h2>
                            </div>

                            <div className="flex items-center justify-center gap-2.5 w-full">
                                <p className="flex-1 mt-[-1.00px] font-text-md font-[number:var(--text-md-font-weight)] text-primary-black text-[length:var(--text-md-font-size)] tracking-[var(--text-md-letter-spacing)] leading-[var(--text-md-line-height)] [font-style:var(--text-md-font-style)]">
                                    Our support team is here to guide you—no matter how big or small
                                    your concern.
                                </p>
                            </div>
                        </header>

                        {contactInfoData.map((item, index) => (
                            <Card
                                key={index}
                                className="flex items-center justify-center gap-5 px-2.5 py-4 w-full bg-gray-color-100 rounded-lg border-0 shadow-none translate-y-[-1rem] animate-fade-in opacity-0"
                                style={
                                    {
                                        "--animation-delay": `${400 + index * 200}ms`,
                                    } as React.CSSProperties
                                }
                            >
                                <CardContent className="flex items-center gap-5 p-0 w-full">
                                    <div className="flex flex-col w-[65px] h-[65px] items-center justify-center gap-2.5 p-2.5 bg-gray-color-200 flex-shrink-0">
                                        <img
                                            className="w-[38px] h-[38px] object-cover"
                                            alt={item.title}
                                            src={item.icon}
                                        />
                                    </div>

                                    <div className="flex flex-col h-[47px] items-start justify-center gap-3 flex-1">
                                        <div className="mt-[-4.50px] flex items-center justify-center gap-2.5 w-full">
                                            <h3 className="flex-1 mt-[-1.00px] font-text-semibold-lg font-[number:var(--text-semibold-lg-font-weight)] text-primary-black text-[length:var(--text-semibold-lg-font-size)] tracking-[var(--text-semibold-lg-letter-spacing)] leading-[var(--text-semibold-lg-line-height)] [font-style:var(--text-semibold-lg-font-style)]">
                                                {item.title}
                                            </h3>
                                        </div>

                                        <div className="mb-[-4.50px] flex items-center justify-center gap-2.5 w-full">
                                            <p className="flex-1 mt-[-1.00px] font-text-md font-[number:var(--text-md-font-weight)] text-primary-black text-[length:var(--text-md-font-size)] tracking-[var(--text-md-letter-spacing)] leading-[var(--text-md-line-height)] [font-style:var(--text-md-font-style)]">
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="flex flex-col items-center justify-center gap-[18px] pt-10 pb-[30px] px-[34px] w-full md:flex-1 bg-primary-white rounded-[14px] shadow-m3-elevation-light-1 border-0 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1000ms]">
                        <CardContent className="flex flex-col gap-[18px] p-0 w-full">
                            <Input
                                type="text"
                                placeholder="Full Name"
                                className="pl-2.5 pr-0 py-4 w-full h-auto bg-primary-white rounded-sm border-[0.8px] border-solid border-black font-text-medium-md font-[number:var(--text-medium-md-font-weight)] text-gray-color-400 text-[length:var(--text-medium-md-font-size)] text-justify tracking-[var(--text-medium-md-letter-spacing)] leading-[var(--text-medium-md-line-height)] [font-style:var(--text-medium-md-font-style)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            <Input
                                type="email"
                                placeholder="Email"
                                className="pl-2.5 pr-0 py-4 w-full h-auto bg-primary-white rounded-sm border-[0.8px] border-solid border-black font-text-medium-md font-[number:var(--text-medium-md-font-weight)] text-gray-color-400 text-[length:var(--text-medium-md-font-size)] text-justify tracking-[var(--text-medium-md-letter-spacing)] leading-[var(--text-medium-md-line-height)] [font-style:var(--text-medium-md-font-style)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            <Input
                                type="tel"
                                placeholder="Phone"
                                className="pl-2.5 pr-0 py-4 w-full h-auto bg-primary-white rounded-sm border-[0.8px] border-solid border-black font-text-medium-md font-[number:var(--text-medium-md-font-weight)] text-gray-color-400 text-[length:var(--text-medium-md-font-size)] text-justify tracking-[var(--text-medium-md-letter-spacing)] leading-[var(--text-medium-md-line-height)] [font-style:var(--text-medium-md-font-style)] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            <Textarea
                                placeholder="Message"
                                className="h-[116px] pl-2.5 pr-0 py-4 w-full bg-primary-white rounded-sm border-[0.8px] border-solid border-black font-text-medium-md font-[number:var(--text-medium-md-font-weight)] text-gray-color-400 text-[length:var(--text-medium-md-font-size)] text-justify tracking-[var(--text-medium-md-letter-spacing)] leading-[var(--text-medium-md-line-height)] [font-style:var(--text-medium-md-font-style)] resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            <Button className="px-[26px] py-3.5 w-full h-auto bg-bgToken hover:bg-bgToken/90 transition-colors rounded-none">
                                <span className="w-fit mt-[-1.00px] font-text-bold-sm font-[number:var(--text-bold-sm-font-weight)] text-primary-white text-[length:var(--text-bold-sm-font-size)] text-justify tracking-[var(--text-bold-sm-letter-spacing)] leading-[var(--text-bold-sm-line-height)] [font-style:var(--text-bold-sm-font-style)]">
                                    Submit
                                </span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

        </div>
    );
};