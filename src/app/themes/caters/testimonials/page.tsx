"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchTestimonials } from "@/services/testimonial.service";
import { User } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
interface DefaultProps { project?: User; }

const testimonialsData = [
    {
        name: "Sandeep Joshi",
        desig: "CEO, Tech Solutions",
        image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-60-3.png",
        description: "Jaipur Food Caterers catered our annual corporate gala, and it was fantastic! From live food stations to gourmet delicacies, everything was perfect. Their professionalism and hospitality stood out.",
    },
    {
        name: "Rajesh Mehta",
        desig: "Business Consultant",
        image: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-61-3.png",
        description: "Jaipur Food Caterers made our corporate event a huge success! The food was fresh, flavorful, and beautifully presented. Their professional service ensured a seamless experience. Highly recommended!",
    },
];
export default function Testimonials({ project }: DefaultProps) {
    const router = useRouter();
    const [testimonialData, setTestimonialData] = useState([]);

    useEffect(() => {
        const fetchClientTestimonials = async () => {
            if (!project?.company_name) {
                setTestimonialData(testimonialsData);
                return;
            }
            
            try {
                const res: any = await fetchTestimonials(project.company_name);
                const data = res?.result?.data || res?.result || res;
                console.log("res:", res);
                console.log("data:", data);

                const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
                const safeBase = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";

                // 🔹 Handle testimonials list (array) or single object
                const resolvedTestimonials = Array.isArray(data)
                    ? data.map((item) => ({
                        ...item,
                        image: resolveImagePath(item.image, safeBase),
                    }))
                    : {
                        ...data,
                        image: resolveImagePath(data.image, safeBase),
                    };

                setTestimonialData(resolvedTestimonials);
            } catch (error) {
                console.error("❌ Error loading testimonials:", error);
                setTestimonialData(testimonialsData);
            }
        };
        fetchClientTestimonials();
    }, [project]);

    /**
     * @param image - Image field (string | array | null)
     * @param base - Base URL (from env or public)
     */

    const resolveImagePath = (image: any, base: string): string | string[] | null => {
        if (!image) return null;

        // If already absolute
        if (typeof image === "string" && image.startsWith("http")) return image;

        // If array of images
        if (Array.isArray(image)) {
            return image.map((p) => (p.startsWith("http") ? p : `${base}${p}`));
        }

        // If stringified JSON array
        if (typeof image === "string" && image.trim().startsWith("[")) {
            try {
                const parsed = JSON.parse(image);
                if (Array.isArray(parsed)) {
                    return parsed.map((p) => (p.startsWith("http") ? p : `${base}${p}`));
                }
            } catch (e) {
                console.warn("⚠️ Failed to parse images JSON:", e);
            }
        }

        // Default single image path
        return `${base}${image}`;
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const goToNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const goToPrevious = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) =>
            prev === 0 ? testimonialData.length - 1 : prev - 1
        );
        setTimeout(() => setIsAnimating(false), 500);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonialData.length]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [testimonialData]);

    return (
        <section className="relative flex flex-col items-center justify-center w-full py-20 px-4 overflow-hidden bg-gradient-to-r from-white to-[#f3f3f3]">
            {/* Decorative quote symbol */}
            <div className="absolute text-[400px] text-gray-300 font-serif opacity-50 top-0 left-[15%] z-10 after:content-['”']" />

            <div className="text-center mb-12">
                <h3 className="text-[#c2302e] [font-family:'Satisfy',Helvetica] text-xl mb-2">
                    Testimonials
                </h3>
                <h2 className="text-[32px] font-bold text-black">What Clients Say</h2>
            </div>

            <div className="relative w-full max-w-[800px] h-[250px]">
                {testimonialData.map((testimonial, index) => (
                    <Card
                        key={index}
                        className={`absolute w-full z-40 max-w-[780px] bg-white rounded-[20px] shadow-lg border-0 transition-all duration-500 ${index === currentIndex
                            ? "opacity-100 translate-x-0"
                            : index < currentIndex
                                ? "opacity-0 -translate-x-full"
                                : "opacity-0 translate-x-full"
                            }`}
                    >
                        <CardContent className="flex flex-col items-center justify-center gap-2.5 px-6 py-4 w-full">
                            <div className="flex items-center gap-3 px-0 py-6 w-full">
                                <Avatar className="w-[70px] h-[70px]">
                                    <AvatarImage
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="object-cover"
                                    />
                                </Avatar>

                                <div className="flex flex-col items-start">
                                    <h4 className="text-[#c2302e] font-semibold text-xl">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-gray-600">{testimonial.desig}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 text-base leading-7 text-center">
                                {testimonial.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Navigation dots */}
            <div className="flex gap-2 mt-6">
                {testimonialData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (!isAnimating) {
                                setIsAnimating(true);
                                setCurrentIndex(index);
                                setTimeout(() => setIsAnimating(false), 500);
                            }
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                            ? "bg-[#c2302e] w-8" : "bg-gray-300 hover:bg-gray-400"}`}
                    />
                ))}
            </div>
        </section>
    );
};