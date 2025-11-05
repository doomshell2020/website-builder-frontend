"use client";

import React, { useEffect, useState } from "react";
import { findSliderByTitle } from "@/services/slider.service";
import Loading from "@/components/ui/loader";
import NotFoundPage from "@/app/not-found";
import { User } from "@/types/user";

interface DefaultProps {
    company?: string;
    slug?: string;
};

export const HeroSlider = ({ company, slug }: DefaultProps): JSX.Element => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [loading, setLoading] = useState(true);
    const [sliderImages, setSliderImages] = useState<string[]>([]);
    const [notFoundPage, setNotFoundPage] = useState(false);

    // 🎯 Fetch dynamic images
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res: any = await findSliderByTitle(company, slug);
                if (Array.isArray(res?.result) && res.result.length > 0) {
                    // Map through all objects and extract image URLs
                    const dynamicImages = res.result
                        .filter((item: any) => item.images) // ensure image exists
                        .map((item: any) =>
                            item.images.startsWith("http")
                                ? item.images
                                : `${process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000/uploads/"}${item.images}`
                        );

                    if (dynamicImages.length > 0) {
                        // 🪄 Add seamless loop (duplicate first)
                        setSliderImages([...dynamicImages, dynamicImages[0]]);
                    } else {
                        setNotFoundPage(true);
                    }
                } else {
                    setNotFoundPage(true);
                }

            } catch (error) {
                console.error("Error fetching slider:", error);
                setNotFoundPage(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ⏱️ Auto-slide every 5 seconds
    useEffect(() => {
        if (!sliderImages.length) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            if (!isTransitioning) setIsTransitioning(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [isTransitioning, sliderImages]);

    // 🔁 Reset transition at end for infinite loop
    useEffect(() => {
        if (sliderImages.length && currentIndex === sliderImages.length - 1) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, sliderImages]);

    // ✨ Animation style
    const slideInAnimationStyle = `
    @keyframes slideInFromBottom {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-slideIn {
      animation: slideInFromBottom 0.7s ease-out;
    }
  `;

    // 🧭 Loading & Error Handling
    if (loading) return <div className="h-[90vh]"><Loading /></div>;
    if (notFoundPage || !sliderImages.length) return <div></div>;

    return (
        <>
            <style>{slideInAnimationStyle}</style>

            <div className="relative flex h-[90vh] w-full items-start justify-center overflow-hidden">
                {/* 🌄 Image Slider */}
                <div
                    className={`flex h-full w-full ${isTransitioning ? "transition-transform duration-1000 ease-in-out" : ""
                        }`}
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {sliderImages.map((src, index) => (
                        <div
                            key={index}
                            className="relative h-full w-full flex-shrink-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${src}')`,
                            }}
                        />
                    ))}
                </div>

                {/* 📝 Overlay Text */}
                <div className="absolute inset-0 flex flex-col items-start justify-center gap-2.5 px-[54px]">
                    <div key={currentIndex} className="animate-slideIn">
                        <h1 className="font-poppins font-bold text-white text-[32px] md:text-[48px] leading-normal">
                            Smart Design, Strong <br /> Foundations
                        </h1>
                        <p className="mt-3 font-inter font-medium text-white text-xl md:text-2xl leading-normal">
                            Blending innovation with quality to build a better tomorrow.
                        </p>
                    </div>
                </div>

                {/* ⚪ Dots Navigation */}
                <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform gap-3">
                    {sliderImages.slice(0, -1).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index);
                                setIsTransitioning(true);
                            }}
                            className={`h-3 w-3 rounded-full transition-all ${currentIndex % (sliderImages.length - 1) === index
                                ? "bg-white"
                                : "bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default HeroSlider;