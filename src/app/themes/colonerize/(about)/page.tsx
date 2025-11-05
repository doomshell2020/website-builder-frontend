"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useInView, animate, Variants } from "framer-motion";
import { User } from "@/types/user";

const statsData = [
  {
    image: "https://c.animaapp.com/mhd81w7aWvI44g/img/image-4-4.png",
    value: 1500,
    suffix: "+",
    label: "Plot Sold",
    delay: 0,
  },
  {
    image: "https://c.animaapp.com/mhd81w7aWvI44g/img/image-4-5.png",
    value: 12,
    suffix: "+",
    label: "Developed Townships",
    delay: 0.2,
  },
  {
    image: "https://c.animaapp.com/mhd81w7aWvI44g/img/image-4-6.png",
    value: 1000,
    suffix: "+",
    label: "Happy Clients",
    delay: 0.4,
  },
  {
    image: "https://c.animaapp.com/mhd81w7aWvI44g/img/image-4-7.png",
    value: 3,
    suffix: "L",
    label: "Total Area sq",
    delay: 0.6,
  },
];
interface DefaultProps {
  project?: User;
};


const AnimatedCounter = ({ target, suffix }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const inView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest));
        },
      });
      return () => controls.stop();
    }
  }, [inView, target, count]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}
      {suffix || ""}
    </span>
  );
};

export default function About({ project }: DefaultProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const missionContent = {
    title: "Our Mission",
    paragraphs: [
      "Our Mission at Navlok Colonizers Group is to consistently deliver eco-conscious, sustainable, and economically viable real estate solutions that are self-sustaining and community-focused — enhancing the quality of life while contributing meaningfully to the planned urban development of our nation.",
      "We are dedicated to creating integrated townships and developments that not only serve the public at large but also uphold our commitment to environmental stewardship, innovation, and long-term value.",
    ],
  };

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div>

      <section className="relative flex min-h-[469px] w-full items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://navlokcolonizers.com/wp-content/uploads/2025/08/page-header-bg-1536x406.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex items-center justify-center"
        >
          <h1 className="text-white text-4xl font-medium tracking-wide font-[Manrope]">
            About
          </h1>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-10 pt-[50px] pb-[50px] w-full"
      >
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex justify-center flex-shrink-0"
        >
          <img
            className="w-[400px] object-cover rounded-xl"
            alt="About Us"
            src="https://c.animaapp.com/mhd81w7aWvI44g/img/frame-5-3.svg"
          />
        </motion.div>

        {/* Right Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col w-[609px] items-start justify-center gap-5 translate-y-[-1rem]"
        >
          <div className="flex flex-col items-start gap-0.5 w-full">
            <div className="inline-flex items-center justify-center gap-2.5">
              <div className="font-medium text-[#00a4e5] w-fit mt-[-1.00px] [font-family:'Manrope',Helvetica] text-lg tracking-[0] leading-[normal]">
                OUR STORY
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-2.5">
              <h2 className="flex-1 mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal] text-3xl font-bold">
                Rooted in Values. Rising with Vision.
              </h2>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-2.5">
            <p className="flex-1 mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-black text-lg text-justify tracking-[0] leading-[18px]">
              <span className="font-bold leading-[27.8px]">
                Navlok Colonizers Group: Building Tomorrow and Today.
              </span>
              <span className="font-light leading-[27.8px]">
                {" "}
                Navlok Colonizers Group stands as one of the most trusted and
                visionary real estate developers in Jaipur. Our mission is to
                redefine the way integrated townships are developed—by creating
                vibrant, sustainable communities that seamlessly blend world-class
                infrastructure with thoughtfully designed amenities.
              </span>
            </p>
          </div>

          <div className="flex w-full items-center justify-center gap-2.5">
            <p className="flex-1 mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-black text-lg text-justify tracking-[0] leading-[18px]">
              <span className="font-light leading-[20.4px]">At </span>
              <span className="font-light leading-[27.8px]">
                NavlokColonizers
              </span>
              <span className="font-light leading-[20.4px]">
                , our work is driven by a deep commitment to enhancing the lives
                of families. We focus on delivering economically planned,
                high-quality real estate projects that not only meet the
                aspirations of our customers but also uphold the highest standards
                of environmental responsibility.
              </span>
            </p>
          </div>


        </motion.div>
      </motion.section>

      <section className="w-full bg-[#000216] py-[52px] px-6 sm:px-10 md:px-[60px] lg:px-[120px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-[31px] place-items-center">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: stat.delay }}
              viewport={{ once: true, amount: 0.2 }}
              className="w-full max-w-[276.75px]"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Card className="bg-[#f9f9f9] border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl h-64 flex items-center justify-center">
                  <CardContent className="flex flex-col items-center gap-[18px] p-5 h-full">
                    <div className="inline-flex flex-col items-center justify-center gap-2.5 p-0.5">
                      <img
                        className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] object-cover"
                        alt={stat.label}
                        src={stat.image}
                      />
                    </div>

                    <h3 className="[font-family:'Manrope',Helvetica] font-semibold text-black text-3xl sm:text-4xl tracking-[0] leading-[normal]">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </h3>

                    <p className="[font-family:'Inter',Helvetica] font-light text-black text-lg sm:text-xl tracking-[0] leading-[normal] text-center">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        ref={ref}
        className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-20 lg:px-32 py-16 md:py-24 bg-gradient-to-br from-[#f8fafc] to-[#eef2f6] w-full"
      >
        {/* Left Image */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex-shrink-0 w-full md:w-1/2 flex justify-center"
        >
          <img
            className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-700 w-full sm:w-4/5 lg:w-[520px] h-auto object-cover"
            alt="Our Mission - Hands holding glowing heart with cityscape"
            src="https://c.animaapp.com/mhd81w7aWvI44g/img/image-2.png"
          />
        </motion.div>

        {/* Right Text Section */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
          className="w-full md:w-1/2 flex flex-col gap-6"
        >
          <h2 className="text-2xl font-medoium text-gray-900 [font-family:'Manrope',Helvetica] leading-snug">
            {missionContent.title}
          </h2>

          {missionContent.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base sm:text-lg text-gray-700 [font-family:'Manrope',Helvetica] font-light text-justify leading-relaxed"
            >
              {paragraph}
            </p>
          ))}


        </motion.div>
      </section>

      <section
        ref={ref}
        className="flex flex-col-reverse md:flex-row items-center justify-center gap-10 px-6 md:px-20 lg:px-32 py-16 md:py-24 bg-gradient-to-br from-[#f9fafb] to-[#eef3f8] w-full"
      >
        {/* Left Text Section */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full md:w-1/2 flex flex-col gap-6"
        >
          <h2 className="text-2xl font-medium text-gray-900 [font-family:'Manrope',Helvetica] leading-snug">
            Our Vision
          </h2>

          <p className="text-base sm:text-lg text-gray-700 [font-family:'Manrope',Helvetica] font-light text-justify leading-relaxed">
            To foster a collaborative and empowering environment where our
            employees, partners, customers, and stakeholders grow together —
            driven by shared success, mutual respect, and a unified commitment to
            excellence.
          </p>

          <p className="text-base sm:text-lg text-gray-700 [font-family:'Manrope',Helvetica] font-light text-justify leading-relaxed">
            By building a values-led, purpose-driven organization, Navlok
            Colonizers Group aspires to become the most trusted and preferred name
            in real estate — recognized not just for the quality of what we build,
            but for the integrity with which we build it.
          </p>


        </motion.div>

        {/* Right Image */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex-shrink-0 w-full md:w-1/2 flex justify-center"
        >
          <img
            className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-700 w-full sm:w-4/5 lg:w-[520px] h-auto object-cover"
            alt="Vision - Modern cityscape with innovation"
            src="https://c.animaapp.com/mhd81w7aWvI44g/img/image-2-1.png"
          />
        </motion.div>
      </section>

    </div>
  );
};