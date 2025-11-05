"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultProps {
  project?: User;
};

export default function HousingAbout({ project }: DefaultProps) {
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
    <div>
      <div className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]">
        <div
          className="flex h-[300px] sm:h-[400px] lg:h-[450px] items-center justify-center w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://c.animaapp.com/mghk811dbdG4xS/img/hero-4.png')",
          }}
        >
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-center">
            About
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 p-20 relative self-stretch w-full flex-[0_0_auto] -mt-10 bg-white rounded-[40px_40px_0px_0px]">
          <div className="flex flex-wrap items-center justify-center gap-[54px_54px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-[30%]">
              <img
                className="w-28 md:w-40 lg:w-40 object-contain opacity-80"
                alt="Decorative Dots"
                src="https://c.animaapp.com/mghk811dbdG4xS/img/dots-1-1.png"
              />
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 relative w-full max-w-[1200px]">
              {/* Left Image */}
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex justify-center flex-shrink-0"
              >
                <img
                  className="w-64 sm:w-80 md:w-[400px] lg:w-[400px] xl:w-[480px] object-cover rounded-xl"
                  alt="About Us"
                  src="https://c.animaapp.com/mghk811dbdG4xS/img/image-34-1.png"
                />
              </motion.div>

              {/* Right Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative flex flex-col gap-6 text-center lg:text-left max-w-2xl"
              >
                {/* Background "OUR STORY" text */}
                <h1 className="absolute -top-6 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 text-6xl font-poppins font-bold text-[#E6F4FF] opacity-70 select-none pointer-events-none">
                  OUR STORY
                </h1>

                {/* Foreground main heading */}
                <h2 className="relative font-poppins font-bold text-black text-2xl sm:text-3xl lg:text-3xl">
                  Designing Spaces, Defining Futures
                </h2>


                <div className="relative font-poppins font-medium text-black text-base ">
                  At NAVVISTAR INFRA, we don’t just construct buildings — we build trust, opportunity, and a better tomorrow
                </div>


                <p className="text-black text-base sm:text-lg">
                  Founded on <span className="font-semibold">July 28, 2025</span>,
                  NAVVISTAR INFRA PVT. LTD. is a visionary construction company built
                  on ambition, innovation, and a commitment to excellence. We are more
                  than just builders — we are forward-thinkers with a clear mission to
                  shape the future of construction through smart design, quality
                  craftsmanship, and sustainable practices.
                </p>

                <p className="text-black text-base sm:text-lg">
                  Driven by a high vision, we aim to set new standards in the industry
                  by delivering modern, efficient, and long-lasting structures that
                  meet the evolving needs of our clients and communities. Our team
                  combines fresh ideas with technical expertise to bring bold concepts
                  to life — safely, on time, and within budget.
                </p>


              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <section className="flex flex-col items-center justify-center w-full bg-[#f0f0f0] py-16 px-6 sm:px-10 lg:px-20 overflow-hidden">
        {/* Our Mission */}
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="flex justify-center w-full lg:w-1/2"
          >
            <img
              className="w-full max-w-[500px] h-auto object-cover rounded-xl shadow-lg"
              alt="Mission"
              src="https://c.animaapp.com/mghk811dbdG4xS/img/image-35-1.png"
            />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            custom={1}
            className="flex flex-col w-full lg:w-1/2 gap-5 text-center lg:text-left"
          >
            <h2 className="text-3xl  font-bold text-black font-poppins">
              Our Mission
            </h2>
            <p className="text-lg sm:text-xl text-gray-800 font-inter leading-relaxed">
              “Our mission is to deliver innovative, high-quality construction
              solutions that exceed expectations and stand the test of time. We are
              committed to building with integrity, leveraging advanced
              technologies, sustainable practices, and a skilled workforce to shape
              modern infrastructure that enhances communities, drives progress, and
              inspires future generations.”
            </p>
          </motion.div>
        </motion.div>

        {/* Our Vision */}
        <motion.div
          className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 w-full max-w-6xl mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="flex flex-col w-full lg:w-1/2 gap-5 text-center lg:text-left"
          >
            <h2 className="text-3xl  font-bold text-black font-poppins">
              Our Vision
            </h2>
            <p className="text-lg sm:text-xl text-gray-800 font-inter leading-relaxed">
              “To build more than structures — to build trust, opportunity, and
              lasting impact. We envision a future where every project reflects
              integrity, innovation, and a commitment to sustainable progress. By
              combining modern construction techniques with timeless values, we aim
              to shape spaces that serve people today and empower generations to
              come.”
            </p>
            <p className="text-lg sm:text-xl text-gray-800 font-inter leading-relaxed">
              “To redefine skylines and shape the future of urban living by
              delivering world-class construction inspired by the bold ambition of
              cities like Dubai. Our vision is to be a driving force in modern
              infrastructure — creating landmark projects that blend innovation,
              sustainability, and visionary design. We aim to transform landscapes,
              elevate lifestyles, and leave a legacy of architectural excellence
              across the world.”
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            custom={1}
            className="flex justify-center w-full lg:w-1/2"
          >
            <img
              className="w-full max-w-[500px] h-auto object-cover rounded-xl shadow-lg"
              alt="Vision"
              src="https://c.animaapp.com/mghk811dbdG4xS/img/image-35-1.png"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};