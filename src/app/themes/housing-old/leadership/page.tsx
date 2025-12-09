"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultHomeProps {
    project?: User;
};

export default function HousingLeadership({ project }: DefaultHomeProps) {
    const router = useRouter();

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1], // ✅ cubic-bezier easing
            },
        },
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            {/* Banner Section */}
            <div
                className="flex h-[300px] sm:h-[400px] lg:h-[450px] items-center justify-center w-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://c.animaapp.com/mghk811dbdG4xS/img/hero-3.png')",
                }}
            >
                <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-poppins text-center">
                    Our Leadership
                </h1>
            </div>

            {/* Leadership Content */}
            <div className="flex flex-col items-center justify-center gap-12 px-6 sm:px-10 lg:px-8 py-12 w-full -mt-10 bg-white rounded-t-[40px]">
                {/* Section 1 */}
                <motion.div
                    className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xl"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"       // Animate on scroll into view
                    whileHover={{ scale: 1.00 }} // Slight zoom on hover
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Left Image */}
                    <motion.div
                        className="flex-shrink-0 w-full lg:w-1/2 flex justify-center"
                        whileHover={{ rotate: 4, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 150 }}
                    >
                        <img
                            className="w-full sm:w-3/4 lg:w-[430px] h-auto object-cover rounded-xl"
                            alt="Mr. Lovendra Choudhary"
                            src="https://c.animaapp.com/mghk811dbdG4xS/img/image-31.png"
                        />
                    </motion.div>

                    {/* Right Content */}
                    <div className="flex flex-col w-full lg:w-1/2 gap-4 text-center lg:text-left">
                        <h2 className="font-poppins text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#201a6d]">
                            Mr. Lovendra Choudhary
                        </h2>
                        <p className="text-black font-inter text-base sm:text-lg lg:text-xl font-medium">
                            MANAGING DIRECTOR
                        </p>
                        <p className="text-gray-800 font-inter text-sm sm:text-base lg:text-lg leading-relaxed">
                            “Success isn’t just about how far we climb — it’s about how solidly we lay the foundation. As a young builder with a visionary mindset, I believe that real growth starts with values, is guided by vision, and is anchored in trust. In construction, just like in life, if the base isn’t strong, nothing lasting can rise. With purpose as our blueprint and perseverance as our tools, progress becomes more than a goal — it becomes inevitable.”
                        </p>
                    </div>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                    className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 w-full border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xl"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ scale: 1.00 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Right Image */}
                    <motion.div
                        className="flex-shrink-0 w-full lg:w-1/2 flex justify-center"
                        whileHover={{ rotate: -4, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 150 }}
                    >
                        <img
                            className="w-full sm:w-3/4 lg:w-[430px] h-auto object-cover rounded-xl"
                            alt="Mr. Aniket Choudhary"
                            src="https://c.animaapp.com/mghk811dbdG4xS/img/image-33.png"
                        />
                    </motion.div>

                    {/* Left Content */}
                    <div className="flex flex-col w-full lg:w-1/2 gap-4 text-center lg:text-left">
                        <h2 className="font-poppins text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#201a6d]">
                            Mr. Aniket Choudhary
                        </h2>
                        <p className="text-black font-inter text-base sm:text-lg lg:text-xl font-medium">
                            DIRECTOR
                        </p>
                        <p className="text-gray-800 font-inter text-sm sm:text-base lg:text-lg leading-relaxed">
                            “Vision isn’t just about having a clear image of the future. It’s about believing so deeply in the future you dream of, that you’re willing to wake up every day and chase it—no matter how far, no matter how hard. True vision is not passive sight, it’s active faith. It’s the fire that drives you forward when there’s no map, only
                            purpose.”
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};