"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types/user";
import Link from "next/link";

interface DefaultProps { project?: User; };

export default function Service({ project }: DefaultProps) {

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

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: (delay = 0) => ({
            opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: "easeOut", },
        }),
    };

    return (
        <div>

            <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
                {/* --- Background Image --- */}
                <img
                    src="https://c.animaapp.com/mhfz0577zdQtqk/img/image-64.png"
                    alt="Hero Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* --- Black Overlay --- */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* --- Content --- */}
                <div className="relative z-10 container mx-auto px-6 md:px-12">
                    <motion.div
                        className="max-w-xl text-left"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.4 }}
                    >
                        <h1 className="font-['Roboto'] font-bold text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
                            Our Services
                        </h1>

                        <p className="font-['Manrope'] text-white text-lg sm:text-xl md:text-2xl font-medium leading-relaxed">
                            Premium Catering Services for Weddings, Events &amp; Special
                            Occasions!
                        </p>
                    </motion.div>
                </div>
            </section>

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

        </div>
    );
};
