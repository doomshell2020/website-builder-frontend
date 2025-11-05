"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User } from "@/types/user";
interface DefaultProps { project?: User; };

export default function PrivacyPolicy({ project }: DefaultProps) {
    const router = useRouter();

    return (
        <div>

            <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
                {/* --- Background Image --- */}
                <img
                    src="https://jaipurfoodcaterers.com/wp-content/uploads/2024/08/privacyPolicyPgBnr.jpg"
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
                            Privacy policy
                        </h1>

                        <p className="font-['Manrope'] text-white text-lg sm:text-xl md:text-2xl font-medium leading-relaxed">
                            Your Privacy Matters – Learn How We Protect Your Data & Information!
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className=" mx-auto  bg-gray-100 shadow-xl rounded-2xl p-6 sm:p-10  w-full max-w-6xl my-8">
                <div className="space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                    <p>
                        When you are on this website and are asked for personal information,
                        you are sharing that information with Jaipur Food Caterers alone,
                        unless it is specifically stated otherwise. If the data is being
                        collected and/or maintained by any company other than Jaipur Food
                        Caterers, you will be notified prior to the time of the data
                        collection or transfer.
                    </p>

                    <p>
                        Please be aware that this website contains links to external websites
                        and once you are on any external website, they may collect personally
                        identifiable information about you. This privacy statement does not
                        cover the information practices of those web sites linked from this
                        website.
                    </p>

                    <p>
                        As a general rule, Jaipur Food Caterers will not disclose or share any
                        of your personally identifiable information except when Jaipur Food
                        Caterers has your permission or under special circumstances, such as
                        when Jaipur Food Caterers believes in good faith that the law
                        requires it or as permitted in terms of this policy.
                    </p>

                    <p>
                        Jaipur Food Caterers may also disclose account information in special
                        cases when it has reasons to believe that disclosing this information
                        is necessary to identify, contact or bring legal action against
                        someone who may be violating our Terms of Service or may be causing
                        injury to or interference with (either intentionally or
                        unintentionally) Jaipur Food Caterers rights or property, other
                        website users, or if Jaipur Food Caterers deems it necessary to
                        maintain, service, and improve its products and services.
                    </p>

                    <p>
                        As with all information, Jaipur Food Caterers will never rent or sell
                        your personal, financial or other information. Unfortunately, no data
                        transmission over the Internet can be guaranteed to be 100% secure.
                        As a result, while Jaipur Food Caterers strives to protect your
                        personal information Jaipur Food Caterers cannot ensure or warrant
                        the security of any information you transmit to Jaipur Food Caterers
                        and you do so at your own risk. Once Jaipur Food Caterers receives
                        your transmission, it makes best efforts to ensure its security on
                        its systems.
                    </p>
                </div>
            </div>

        </div>
    );
};