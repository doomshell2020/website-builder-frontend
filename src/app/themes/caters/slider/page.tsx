"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { findSliderByTitle } from "@/services/slider.service";
import Loading from "@/components/ui/loader";
import { Button } from "@/components/ui/Button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
interface DefaultProps { company?: string; slug?: string; }

export default function HeroSlider({ company, slug }: DefaultProps): JSX.Element {
    const router = useRouter();
    const [sliderImages, setSliderImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [emblaRef] = useEmblaCarousel(
        { loop: true, dragFree: false },
        [Autoplay({ delay: 4000, stopOnInteraction: false })]
    );

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const res: any = await findSliderByTitle(company, slug);
                if (Array.isArray(res?.result) && res.result.length > 0) {
                    const dynamicImages = res.result
                        .filter((item: any) => item.images)
                        .map((item: any) =>
                            item.images.startsWith("http")
                                ? item.images
                                : `${process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000/uploads/"}${item.images}`
                        );
                    setSliderImages(dynamicImages);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Error loading slider:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, [company, slug]);

    if (loading) return <div className="h-[60vh]"><Loading /></div>;
    if (notFound || !sliderImages.length) return <div></div>;

    const slides = sliderImages.length === 1 ? [...sliderImages, sliderImages[0]] : sliderImages;
    return (
        <section className="relative w-full h-[400px] md:h-[550px] lg:h-[600px] overflow-hidden">
            {/* 🎞️ Slider images (moving background) */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((image, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] min-w-0 relative w-full h-[514px]"
                        >
                            <img
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {/* semi-transparent dark overlay for readability */}
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🏗️ Fixed overlay text — stays constant */}
            <div className="absolute max-w-[600px] inset-0 flex flex-col justify-center items-start px-[54px] text-white z-20">
                <h5 className="text-lg md:text-lg font-bold mb-3 uppercase">
                    {`WELCOME TO ${company || "JAIPUR FOOD CATERERS"}`}
                </h5>
                <h2 className="text-5xl leading-[3rem] mb-6">
                    Creating Unforgettable Dining Experiences for Your Guests
                </h2>
                <Button
                    onClick={() => router.push("/contact")}
                    className="bg-[#c2302e] hover:bg-[#a02826] text-lg px-8 py-4 rounded-[30px] shadow-lg">
                    Get a Quote
                </Button>
            </div>
        </section>
    );
};