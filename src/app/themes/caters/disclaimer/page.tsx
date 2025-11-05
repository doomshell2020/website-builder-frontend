"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User } from "@/types/user";
interface DefaultProps { project?: User; };

export default function Disclaimer({ project }: DefaultProps) {
    const router = useRouter();

    return (
        <div>

            <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
                {/* --- Background Image --- */}
                <img
                    src="https://jaipurfoodcaterers.com/wp-content/uploads/2024/08/disclaimerPgBnr.jpg"
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
                            Disclaimer
                        </h1>

                        <p className="font-['Manrope'] text-white text-lg sm:text-xl md:text-2xl font-medium leading-relaxed">
                            Legal Disclaimer – Understand Our Policies & Liability Guidelines!
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className=" mx-auto  bg-gray-100 shadow-xl rounded-2xl p-6 sm:p-10  w-full max-w-6xl my-8">
                <div className="space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                    <p>
                        Any use - or misuse – of information / data presented on this website is complete at the user´s own risk. Before using any information / data the user must check the relevant details regarding the authenticity, practicality, usability, risks associated etc. and must ensure that its usage is in accordance with legal regulations, legislations etc. Links to other website from this website does not mean that we approve or take any responsibility for the information / data / material provided on the linked websites. For all documents, pictures and information available on this website, Jaipur Food Caterers does not warrant or assume any legal liability or responsibility for the accuracy, completeness or usefulness of any information / data / material.
                    </p>

                    <p>
                        By accessing this website, you acknowledge that any reliance upon any material or information provided on this website shall be at your sole risk. Jaipur Food Caterers reserves the right in its sole discretion and without any obligation or explanation, to make changes, correct or delete any presented information / document / picture / material without prior notice.
                    </p>
                </div>
            </div>

        </div>
    );
};