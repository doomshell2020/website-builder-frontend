"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User } from "@/types/user";
interface DefaultProps { project?: User; };

export default function TermsAndConditions({ project }: DefaultProps) {
    const router = useRouter();

    return (
        <div>

            <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
                {/* --- Background Image --- */}
                <img
                    src="https://jaipurfoodcaterers.com/wp-content/uploads/2024/08/termsPgBnr.jpg"
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
                            Terms and Conditions
                        </h1>

                        <p className="font-['Manrope'] text-white text-lg sm:text-xl md:text-2xl font-medium leading-relaxed">
                            Understand Our Terms & Conditions for a Smooth Catering Experience!
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className=" mx-auto  bg-gray-100 shadow-xl rounded-2xl p-6 sm:p-10  w-full max-w-6xl my-8">
                <div className="space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                    <p>
                        By accessing, browsing and/or using this web site, you acknowledge that you have read, understood, and agree to these terms and conditions. If you do not agree to the specified terms and conditions, we suggest you not to use this website.
                    </p>
                    <p>
                        Any/all information on this website may be changed or updated without notice.
                    </p>
                    <p>
                        This website may contains copyright information which cannot be re-produced by you without the prior written approval from Jaipur Food Caterers. By giving information, Jaipur Food Caterers not grant any licenses to any copyrights or any other intellectual property rights.
                    </p>
                    <p>
                        Information on this Web site may contain technical inaccuracies or typographical errors and you will not hold Jaipur Food Caterers possible for losses/difficulties occurring because of such inaccuracies and errors. Jaipur Food Caterers assumes no responsibility regarding the accuracy and use of such information is at the recipient's own risk.
                    </p>
                    <p>
                        Any information or material sent to Jaipur Food Caterers through this website will be deemed NOT to be confidential. By sending Jaipur Food Caterers any information or material, you grant Jaipur Food Caterers an unrestricted, irrevocable license to use, reproduce, display, perform, modify, transmit and distribute those materials or information, and you also agree that Jaipur Food Caterers is free to use any ideas, concepts, know-how or techniques that you send us for any purpose.
                    </p>
                    <p>
                        Jaipur Food Caterers makes no representations whatsoever about any other website which may be linked from this website. A link to a non- Jaipur Food Caterers Web site does not mean that Jaipur Food Caterers endorses or accepts any responsibility for the content, or the use, of such Web site. It is up to you to take precautions to ensure that whatever you select for your use is free of such items as viruses, worms, Trojan horses and other items of a destructive nature
                    </p>
                    <p>
                        When you access a non- Jaipur Food Caterers Web site, even one that may contain our name / logo, please understand that it is independent from Jaipur Food Caterers and that Jaipur Food Caterers has no control over the content on that Web site.
                    </p>
                    <p>
                        In no event will Jaipur Food Caterers be liable to any party for any direct, indirect, special or other consequential damages for any use of this web site, or on any other hyper linked website, including, without limitation, any lost profits, business interruption, loss of programs or other data on your information handling system or otherwise, even if we are expressly advised of the possibility of such damages.
                    </p>
                    <p>
                        All information is provided by Jaipur Food Caterers on an "as is" basis only. Jaipur Food Caterers provides no representations and warranties, express or implied, including the implied warranties of fitness for a particular purpose, merchantability and non-infringement.
                    </p>
                    <p>
                        Jaipur Food Caterers may at any time revise these terms by updating this posting. By using this web site, you agree to be bound by any such revisions and should therefore periodically visit this page to determine the then current terms and conditions for accessing / using this website.
                    </p>
                </div>
            </div>

        </div>
    );
};