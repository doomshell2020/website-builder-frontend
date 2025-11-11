"use client";

import React, { useEffect, useState } from "react";
import HeroSlider from "../slider/page";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { motion, useAnimation, Variants } from "framer-motion";
import { findGalleryBySlug } from "@/services/gallery.service";
import { useInView } from "react-intersection-observer";
import LightBox from "@/components/Lightbox";
import Link from "next/link";

interface DefaultHomeProps { project?: User; };

export default function Home({ project }: DefaultHomeProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

    React.useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    // const fallbackImages = [
    //     "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-8.png",
    //     "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-9.png",
    //     "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-10.png",
    //     "https://navlokcolonizers.com/wp-content/uploads/2025/08/sliderBnr-2-1024x373.jpg",
    //     "https://navlokcolonizers.com/wp-content/uploads/2025/08/sliderBnr-3-1024x373.jpg",
    //     "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-13.png",
    //     "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-14.png",
    //     "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-15.png",
    //     "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-16.png",
    // ];

    // useEffect(() => {
    //     const fetchGalleryImages = async () => {
    //         if (!project?.company_name) {
    //             setImagePreviews(fallbackImages);
    //             setLoading(false);
    //             return;
    //         }
    //         setLoading(true);
    //         try {
    //             const res: any = await findGalleryBySlug(project.company_name, "gallery");
    //             const data = res?.result || res;
    //             let imgs: string[] = [];
    //             if (data?.images) {
    //                 const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
    //                 const safeBase = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";

    //                 if (Array.isArray(data.images)) {
    //                     imgs = data.images.map((p: string) =>
    //                         p.startsWith("http") ? p : `${safeBase}${p}`
    //                     );
    //                 } else if (typeof data.images === "string" && data.images.trim().length > 0) {
    //                     try {
    //                         const parsed = JSON.parse(data.images);
    //                         if (Array.isArray(parsed)) {
    //                             imgs = parsed.map((p: string) =>
    //                                 p.startsWith("http") ? p : `${safeBase}${p}`
    //                             );
    //                         } else {
    //                             imgs = [parsed.startsWith("http") ? parsed : `${safeBase}${parsed}`];
    //                         }
    //                     } catch {
    //                         imgs = [
    //                             data.images.startsWith("http")
    //                                 ? data.images
    //                                 : `${safeBase}${data.images}`,
    //                         ];
    //                     }
    //                 }
    //             }
    //             setImagePreviews(imgs.length > 0 ? imgs : fallbackImages);
    //         } catch (error) {
    //             console.error("❌ Error loading gallery:", error);
    //             setImagePreviews(fallbackImages);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchGalleryImages();
    // }, [project]);

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
        }),
    };

    const eventCards = [
        {
            title: "Wedding Event",
            link: "/services/wedding-event",
            description:
                "Make your wedding special with exquisite catering, custom menus & fresh flavors!",
            image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-36-1.png",
        },
        {
            title: "Birthday Party",
            link: "/services/birthday",
            description:
                "Make your birthday special with delicious catering, fresh food & custom menus!",
            image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-37-1.png",
        },
        {
            title: "Corporate Event",
            link: "/services/corporate",
            description:
                "Impress your guests with corporate catering, delicious menus & professional service!",
            image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-38-1.png",
        },
        {
            title: "Social Event",
            link: "/services/social-events",
            description:
                "Elevate your social event with catering, delicious food, custom menus & seamless service!",
            image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-39-1.png",
        },
        {
            title: "Wedding Anniversary",
            link: "/services/anniversary",
            description:
                "Celebrate your anniversary with exquisite catering, delicious food & custom menus!",
            image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-40-1.png",
        },
        {
            title: "Ring Ceremony",
            link: "/services/ring-ceremony",
            description:
                "Make your ring ceremony special with elegant catering, delicious food & custom menus!",
            image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-41-1.png",
        },
        {
            title: "Inauguration",
            link: "/services/inauguration",
            description:
                "Make your inauguration grand with premium catering, delicious food & custom menus!",
            image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-42-1.png",
        },
        {
            title: "Theme Party",
            link: "/services/theme-party",
            description:
                "Make your theme party shine with custom catering, delicious food & seamless service!",
            image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-43-1.png",
        },
    ];

    const fadeUps: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay,
                duration: 0.6,
                ease: "easeOut",
            },
        }),
    };

    const previewImages = [
        { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/02/new4a-300x225.jpg", alt: "Elegant evening event setup with decorative food station" },
        { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_8large-300x226.jpg" },
        { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_61large-300x169.jpg", alt: "Sophisticated dessert display" },
        { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_46large-300x225.jpg", alt: "Beautiful outdoor event at twilight" },
        { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_2large-300x289.jpg", alt: "Stunning event venue at night" },
        { src: "https://jaipurfoodcaterers.com/wp-content/uploads/2025/03/img_20large-300x225.jpg", alt: "Premium event food service station" },
    ];

    const handleImageClick = (index: number) => {
        setSelectedIndex(index);
        setIsLightboxOpen(true);
    };

    const containerVariantsForService: Variants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <div>
            {/** Hero Section */}
            <HeroSlider company={project?.schema_name} slug={"home"} />

            {/** About Section */}
            <section
                ref={ref}
                id="about"
                className="flex flex-col items-center justify-center gap-8 px-6 md:px-10 lg:px-20 py-16 w-full bg-white rounded-t-[40px]"
            >
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 w-full max-w-7xl">
                    {/* Image Section */}
                    <motion.div
                        className="flex justify-center"
                        variants={fadeUp}
                        initial="hidden"
                        animate={controls}
                        custom={0.1}
                    >
                        <img
                            className="w-full max-w-[420px] md:max-w-[480px] lg:max-w-[530px] h-auto object-cover rounded-xl"
                            alt="Jaipur Food Caterers"
                            src="https://c.animaapp.com/mhfz0577zdQtqk/img/image-35-1.png"
                        />
                    </motion.div>

                    {/* Text Section */}
                    <div className="flex flex-col items-start gap-5 max-w-xl text-center lg:text-left">
                        {/* Small Heading */}
                        <motion.p
                            variants={fadeUp}
                            initial="hidden"
                            animate={controls}
                            custom={0.2}
                            className="[font-family:'Satisfy',Helvetica] text-[#c2302e] text-lg md:text-xl"
                        >
                            About Us
                        </motion.p>

                        {/* Title */}
                        <motion.h2
                            variants={fadeUp}
                            initial="hidden"
                            animate={controls}
                            custom={0.4}
                            className="font-roboto font-bold text-black text-2xl md:text-3xl lg:text-4xl leading-snug"
                        >
                            Welcome to <br className="hidden md:block" /> Jaipur Food Caterers
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            variants={fadeUp}
                            initial="hidden"
                            animate={controls}
                            custom={0.6}
                            className="font-inter text-gray-700 text-base md:text-lg leading-relaxed"
                        >
                            Jaipur Food Caterers is a unit of Prabhu Narayan Halwai. A brand name of
                            100% pure vegetarian catering serving valuable customers since 1974.
                            Founded by Sh. Prabhu Narayan Ji, we are renowned for exquisite food
                            preparation and hospitality across Jaipur for over 40 years.
                            <br />
                            <br />
                            Our master chefs and artisans from all over India bring you a multi-cuisine
                            experience — Indian, Chinese, Continental, Italian, and more — for every
                            occasion.
                        </motion.p>

                        {/* Button */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate={controls}
                            custom={0.8}
                        >
                            <Button
                                onClick={() => router.push("/about")}
                                className="px-8 py-3 h-auto bg-[#c2302e] hover:bg-[#a02826] transition-colors duration-300 rounded-full text-white text-lg font-medium shadow-lg">
                                View More
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/** Service Section */}
            <section
                id="events"
                className="w-full bg-[#f7f7f7] py-16 px-4 sm:px-6 md:px-8 lg:px-10"
            >
                <motion.div
                    className="flex flex-col items-center gap-12 max-w-[1200px] mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.header
                        className="flex flex-col items-center gap-2 max-w-[394px] text-center"
                        variants={fadeUp}
                        custom={0.1}
                    >
                        <div className="[font-family:'Satisfy',Helvetica] font-normal text-[#c2302e] text-xl">
                            Our Services
                        </div>
                        <h2 className="[font-family:'Roboto',Helvetica] font-bold text-black text-[28px] sm:text-[32px] leading-snug">
                            Premium Catering Services
                        </h2>
                    </motion.header>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
                        variants={fadeUp}
                        custom={0.3}
                    >
                        {eventCards.map((event, index) => (
                            <motion.div
                                key={index}
                                variants={fadeUp}
                                custom={0.2 + index * 0.1}
                                className="flex justify-center"
                            ><Link href={event?.link ?? "#"} >
                                    <Card className="group relative overflow-hidden border-0 shadow-none bg-transparent w-full max-w-[270px] sm:max-w-full mx-auto">
                                        <CardContent className="p-0 relative">
                                            <div className="relative w-full h-[320px] sm:h-[360px] md:h-[380px] overflow-hidden rounded-2xl shadow-md group">
                                                {/* Image */}
                                                <img
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    alt={event.title}
                                                    src={event.image}
                                                />

                                                {/* Always dimmed overlay */}
                                                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500" />

                                                {/* Text container */}
                                                <div className="absolute bottom-[-96px] left-0 right-0 px-4 py-6 flex flex-col gap-2 transition-all duration-500 ease-out group-hover:bottom-0">
                                                    {/* Title (always visible) */}
                                                    <h3 className="[font-family:'Inter',Helvetica] font-semibold text-white text-xl sm:text-2xl">
                                                        {event.title}
                                                    </h3>

                                                    {/* Description (hidden initially, slides up on hover) */}
                                                    <p className="[font-family:'Inter',Helvetica] font-normal text-white text-sm sm:text-base leading-relaxed">
                                                        {event.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/** Gallery Section */}
            <div>
                <section
                    className="container py-8 md:py-8"
                    onMouseEnter={() => !hasAnimated && setHasAnimated(true)}
                >
                    {/* Heading */}
                    <div className="mb-8 text-center">
                        <div className="[font-family:'Satisfy',Helvetica] font-normal text-[#c2302e] text-xl">
                            Gallery
                        </div>
                        <div className="[font-family:'Roboto',Helvetica] font-bold text-black text-[28px] sm:text-[32px] leading-snug">
                            Our Events Gallery
                        </div>
                    </div>

                    {/* Image Grid */}
                    <motion.div
                        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        variants={containerVariantsForService}
                        initial="hidden"
                        animate={hasAnimated ? "visible" : "hidden"}
                    >
                        {previewImages.map((image, index) => (
                            <motion.div
                                key={index}
                                variants={imageVariants}
                                className="gallery-hover group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
                                onClick={() => handleImageClick(index)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                                    if (e.key === "Enter" || e.key === " ") handleImageClick(index);
                                }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="h-full w-full object-cover transition-transform duration-400"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 transition-colors duration-400 group-hover:bg-black/20" />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ✨ Explore More Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-10 flex justify-center"
                    >
                        <Button
                            size="lg"
                            className="rounded-full bg-[#c2302e] hover:bg-[#a62625] text-white px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:scale-105"
                            // onClick={() => router.push("/gallery")}
                            onClick={() => router.push("#")}
                        >
                            Explore More
                        </Button>
                    </motion.div>
                </section>

                {/* Lightbox */}
                {isLightboxOpen && (
                    <LightBox
                        initialIndex={selectedIndex}
                        onClose={() => setIsLightboxOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};