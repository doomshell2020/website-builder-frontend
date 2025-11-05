"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { findSliderByTitle } from "@/services/slider.service";
import Loading from "@/components/ui/loader";

interface DefaultProps {
  company?: string;
  slug?: string;
}

export const HeroSlider = ({ company, slug }: DefaultProps): JSX.Element => {
  // 🌀 No autoplay plugin here
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });

  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // 🧭 Fetch slider images dynamically
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

  // 🔄 Track current slide
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // 🧭 Manual scroll by dots
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // 🌀 Loading & Fallback
  if (loading) return <div className="h-[90vh]"><Loading /></div>;
  if (notFound || !sliderImages.length) return <div></div>;

  return (
    <div className="relative w-full animate-fade-in translate-y-[-1rem]">
      {/* 🖼️ Main Embla Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {sliderImages.map((image, index: number) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-[514px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ⚪ Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* ⬅️ Prev Button */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-10"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* ➡️ Next Button */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-10"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default HeroSlider;
