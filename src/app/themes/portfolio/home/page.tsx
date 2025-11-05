"use client";

import Image from "next/image";
import { User } from "@/types/user";

interface DefaultHomeProps {
    project?: User;
};

export default function PortfolioHome({ project }: DefaultHomeProps) {
    return (
        <div className="bg-white text-gray-800">
            {/* Hero */}
            <section className="px-10 py-24 text-center">
                <h2 className="text-5xl font-bold mb-4">Hello, I'm a Developer</h2>
                <p className="text-lg max-w-2xl mx-auto">
                    I create productive and user-friendly digital experiences & mobile application.
                </p>
            </section>

            {/* Work Showcase */}
            <section id="work" className="px-10 py-16">
                <h3 className="text-3xl font-semibold mb-10 text-center">My Work</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            img: "/assest/image/portfolio3.jpg",
                            label: "Modern Art",
                        },
                        {
                            img: "/assest/image/portfolio1.jpg",
                            label: "Unique Bussiness",
                        },
                        {
                            img: "/assest/image/portfolio4.jpg",
                            label: "Interior Designing",
                        },
                    ].map((item, i) => (
                        <div key={i}>
                            <div
                                key={i}
                                className="group relative rounded-xl overflow-hidden cursor-pointer"
                            >
                                <Image
                                    src={item.img}
                                    alt={item.label}
                                    width={400}
                                    height={210}
                                    className="object-cover min-h-[210px] max-h-[200px] w-full group-hover:scale-105 transition-all duration-500"
                                />
                            </div>
                            <div className="text-center text-xl mt-2 font-semibold text-black drop-shadow-md">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};