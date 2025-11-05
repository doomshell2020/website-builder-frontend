"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultProps {
    project?: User;
};

export default function OurLeadership({ project }: DefaultProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const leadershipProfiles = [
        {
            id: 1,
            name: "Dr. Narendra Choudhary",
            position: "Chairman and Managing Director",
            image: "https://c.animaapp.com/mhd81w7aWvI44g/img/frame-5.svg",
            quote:
                "True success isn’t just about reaching new heights—it’s about building on a foundation of trust, purpose, and unwavering values. When vision is clear and commitment is strong, growth becomes a natural outcome.",
            fullBio: [
                "Dr. Narendra Singh Choudhary serves as the guiding force behind this organization, leading with a clear vision, steadfast values, and strategic foresight. Known for his deep commitment, timely decision-making, and solution-oriented mindset, he consistently drives innovation across systems, operations, and people—ensuring continuous growth and excellence.",
                "Hailing from a large family of four siblings, Dr. Choudhary’s early life was shaped by resilience and hard work. He began his professional journey as an LIC agent and later founded a school in Khandar Tehsil, Sawai Madhopur district of Rajasthan, where he also served as a teacher. His passion for education led him to take up a professorial role at a B.Ed. college, where he taught educational psychology to aspiring educators.",
                "In 2012, driven by an entrepreneurial spirit, Dr. Choudhary transitioned from teaching to explore opportunities in sales and marketing, a field in which he worked until 2014. Between 2014 and 2019, he returned to academia and resumed his role in teacher education. In 2019, he made a pivotal shift into the real estate sector. After in-depth research and a strong commitment to learning, he embarked on a new path in this dynamic industry.",
                "His real estate journey formally began in 2022 when he co-founded High Fly Real Estate with four close associates. The venture was a success, paving the way for his most ambitious project yet. On June 30, 2025, he launched a visionary new enterprise—Navlok Group—with the mission to develop world-class, sustainable, and economically planned townships equipped with modern infrastructure and premium amenities.",
                "With over six years of dedicated experience in real estate, Dr. Choudhary remains focused on innovation, sustainability, and uncompromising quality, shaping the future of integrated township development in India.",
            ],
        },
        {
            id: 2,
            name: "Lilavati Choudhary",
            position: "Director",
            image: "https://c.animaapp.com/mhd81w7aWvI44g/img/frame-5-1.svg",
            quote: "The Silent Strategist Behind the Vision",
            fullBio: [
                "As a Director and the wife of Managing Director Dr. Narendra Choudhary, Lilavati Choudhary plays an indispensable role in the company’s leadership. Far more than a title, her presence brings depth, foresight, and balance to the boardroom. Walking in step with her husband, she offers not only unwavering support but also sharp insight and thoughtful counsel that help steer the company toward its long-term goals.",
                "With a keen understanding of both strategy and values, she ensures that each decision aligns with the broader mission. Her voice may be soft-spoken, but her influence is profound—quietly shaping policies, refining visions, and reinforcing a culture of strong governance. A trusted adviser, a grounded visionary, and an enduring force behind the scenes, Lilavati Choudhary remains a vital cornerstone of the company’s journey to excellence.",
            ],
        },
    ];

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
        <div>
            <section className="relative flex w-full min-h-[469px] items-center justify-center overflow-hidden">
                {/* Background image */}
                <img
                    src="https://c.animaapp.com/mhd81w7aWvI44g/img/frame-1000004023.png"
                    alt="Leadership Background"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.58)]" />

                {/* Text container with fade-in effect */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 flex items-center justify-center translate-y-[-1rem]"
                >
                    <h1 className="text-white text-4xl font-medium tracking-wide font-[Manrope]">
                        Our Leadership
                    </h1>
                </motion.div>
            </section>

            <section
                ref={ref}
                className="flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 py-16 w-full bg-gray-50"
            >
                <div className="w-full max-w-[1300px] flex flex-col gap-24">
                    {leadershipProfiles.map((profile, index) => (
                        <motion.article
                            key={profile.id}
                            variants={fadeUp}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="flex flex-col w-full max-w-[1200px] gap-10"
                        >
                            {/* Top Section: Image + Intro */}
                            <div
                                className={`flex flex-col md:flex-row ${profile.id === 2 ? "md:flex-row-reverse justify-around" : ""
                                    } items-start md:items-center gap-10`}
                            >
                                <motion.img
                                    src={profile.image}
                                    alt={`${profile.name} portrait`}
                                    className="w-full md:w-[320px] lg:w-[360px] rounded-xl shadow-lg object-cover hover:scale-105 transition-transform duration-700"
                                />

                                <div className="flex flex-col gap-3">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                        {profile.name}
                                    </h2>
                                    <p className="text-lg text-gray-800 font-medium uppercase tracking-wide font-bold">
                                        {profile.position}
                                    </p>
                                    <blockquote className="border-l-4 border-[#0d6efd] pl-4 text-gray-800 text-base sm:text-lg leading-relaxed font-bold">
                                        “{profile.quote}”
                                    </blockquote>
                                </div>
                            </div>

                            {/* Full Width Bio Section */}
                            {profile.fullBio.length > 0 && (
                                <div
                                    className={`w-full mt-4 py-8 px-4 sm:px-8 md:px-12 lg:px-20 rounded-xl shadow-xl border border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-white"
                                        }`}
                                >
                                    <div className="flex flex-col gap-5">
                                        {profile.fullBio.map((paragraph, i) => (
                                            <p
                                                key={i}
                                                className="text-gray-700 text-base sm:text-lg font-light text-justify leading-relaxed"
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.article>
                    ))}
                </div>
            </section>
        </div>
    );
};