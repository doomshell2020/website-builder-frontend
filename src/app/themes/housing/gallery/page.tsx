"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import { findGalleryBySlug } from "@/services/gallery.service";
import { User } from "@/types/user";
import { motion, Variants } from "framer-motion";
interface DefaultProps { project?: User; }

export default function HousingGallery({ project }: DefaultProps) {
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
        "/assest/image/gallery-12.jpg",
        "/assest/image/gallery-10.jpg",
        "/assest/image/gallery-11.jpg",
    ];

    useEffect(() => {
        const fetchGalleryImages = async () => {
            if (!project?.company_name) {
                setImagePreviews(fallbackImages);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const res: any = await findGalleryBySlug(project.company_name, "gallery");
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
                                imgs = [
                                    parsed.startsWith("http") ? parsed : `${safeBase}${parsed}`,
                                ];
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
            transition: { duration: 0.6, staggerChildren: 0.15 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    return (
        <div className="flex flex-col items-center relative bg-white">

            <div
                className="flex h-[450px] items-center justify-center w-full bg-cover bg-center bg-no-repeat relative"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/assest/image/gallerybanner-1.jpg')",
                }}
            >
                <h1 className="text-white text-4xl md:text-5xl font-bold font-poppins">
                    Gallery
                </h1>
            </div>

            {loading ? (<div className="min-h-[420px] flex items-center justify-center"><Loader /></div>) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pb-16 pt-8 px-6 rounded-3xl shadow-2xl justify-center bg-white mb-10 -mt-12 z-50"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {imagePreviews.map((src, index) => (
                        <motion.div
                            key={index}
                            className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                            variants={itemVariants}
                        >
                            <img
                                src={src}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};