"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card"
import { useInView } from "react-intersection-observer";

const feature = [
  {
    src: "https://jaipurfoodcaterers.com/wp-content/uploads/2024/08/howItWorkImg3.png   ",
    title: "Hygiene and Safety",
    description:
      "At Jaipur Food Caterers, we prioritize hygiene and safety with fresh ingredients, sanitized kitchens & strict quality checks for a safe and delicious experience.",
  },
  {
    src: "https://jaipurfoodcaterers.com/wp-content/uploads/2024/08/howItWorkImg2.png",
    title: "Time-Saving",
    description:
      "Jaipur Food Caterers saves your time with seamless catering services, from menu planning to setup, ensuring a hassle-free and delicious experience.",
  },
  {
    src: "https://jaipurfoodcaterers.com/wp-content/uploads/2024/08/howItWorkImg1.png",
    title: "Professional Service",
    description:
      "Jaipur Food Caterers delivers professional service with expert chefs, trained staff, and seamless execution to make your event smooth and stress-free.",
  },
];

const features = [
  {
    icon: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-68.png",
    title: "High-Quality Ingredients",
    description:
      "We use fresh, high-quality ingredients to create delicious, flavorful dishes that elevate every event.",
  },
  {
    icon: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-69.png",
    title: "Customized Setups",
    description:
      "Get beautifully customized setups tailored to your theme, creating a unique and memorable experience.",
  },
  {
    icon: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-70.png",
    title: "Professional Service",
    description:
      "Experience top-notch professional service with expert chefs, trained staff, and seamless event execution.",
  },
  {
    icon: "https://c.animaapp.com/mhfz0577zdQtqk/img/image-71.png",
    title: "Tailored Menus",
    description:
      "Enjoy tailored menus crafted to suit your taste, preferences, and event theme for a perfect dining experience.",
  },
];

export default function Corporate() {

  const fadeInUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay },
    },
  });

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div>
      <div className="relative w-full">
        {/* --- Background Image with Overlay --- */}
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="About Us Banner"
            src="https://jaipurfoodcaterers.com/wp-content/uploads/2024/08/corporateEventPgBnr.jpg"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* --- Content Section --- */}
        <div className="absolute inset-0 flex flex-col justify-center items-center lg:items-start px-4 lg:px-24 text-center lg:text-left">
          {/* Heading Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="[font-family:'Roboto',Helvetica]  font-bold text-white text-3xl md:text-5xl lg:text-[42px] leading-tight mb-4"
          >
            Corporate Event
          </motion.h1>

          {/* Subtitle Animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="font-manrope font-semibold text-white text-lg md:text-xl max-w-xl"
          >
            Impress your guests with corporate catering, delicious menus & professional service!
          </motion.div>
        </div>
      </div>


      <div className="flex flex-col items-center justify-center gap-10 px-6 md:px-10 lg:px-20 pt-16 pb-10 w-full bg-white rounded-t-[40px] overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full">
          {/* --- Image Section --- */}
          <motion.div
            variants={fadeInUp(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center w-full lg:w-1/2"
          >
            <img
              className="w-full max-w-[530px] h-auto object-cover rounded-2xl shadow-md"
              alt="Jaipur Food Caterers catering services"
              src="https://jaipurfoodcaterers.com/wp-content/uploads/2024/08/weddingEventSecImg.jpg"
            />
          </motion.div>

          {/* --- Content Section --- */}
          <div className="flex flex-col w-full lg:w-1/2 gap-5">
            <motion.div
              variants={fadeInUp(0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-[Satisfy] text-[#c2302e] text-2xl"
            >
              Corporate Event
            </motion.div>

            <motion.h2
              variants={fadeInUp(0.3)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-roboto font-bold text-2xl sm:text-3xl md:text-4xl text-black leading-snug"
            >
              Enhance Your Corporate Event with Jaipur Food Caterers
            </motion.h2>

            <motion.div
              variants={fadeInUp(0.4)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-base sm:text-lg md:text-xl text-black font-inter leading-relaxed space-y-4"
            >
              <p>
                Make your corporate event a success with <span className="font-bold">Jaipur Food Caterers</span>
                ! We offer a professional catering experience with customized menus designed to impress clients, employees, and business associates. Our expert chefs craft delicious, high-quality dishes using fresh ingredients, ensuring a delightful dining experience. Whether it’s a business meeting, seminar, product launch, or annual gala, our seamless service and elegant presentation add a touch of excellence to your event.
              </p>
              <p>
                At <span className="font-bold">Jaipur Food Caterers</span>
                , we understand the importance of professionalism and efficiency. Our dedicated team ensures timely service, hassle-free setup, and a refined dining experience tailored to your event’s needs. From gourmet meals to light refreshments, we provide a variety of options to suit your preferences. Let us handle the catering so you can focus on networking, presentations, and making lasting business connections!
              </p>
            </motion.div>
          </div>
        </div>

        {/* --- Second Paragraph --- */}

      </div>


      <div
        ref={ref}
        className="w-full bg-gradient-to-b from-white to-[#fff8f8] py-16 px-6 flex flex-col items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
          {feature.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="mb-5">
                  <img
                    src={item.src}
                    alt={item.title}
                    width={90}
                    height={90}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-10 px-6 sm:px-10 lg:px-20 pt-16 pb-10 w-full bg-white rounded-t-[40px] overflow-hidden">
        <div className=" relative flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full max-w-[1400px]">
          {/* --- Image Section --- */}
          <motion.div
            variants={fadeInUp(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative flex items-center justify-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-8"
          >
            {/* Decorative background block */}
            <div className="absolute top-[-40px] left-0 sm:left-[-50px] md:left-[-80px] lg:left-[-100px] 
                  w-[40%] sm:w-[35%] md:w-[50%] h-[85%] sm:h-[115%] 
                  bg-[#c2302e] z-0 rounded-2xl transition-all duration-300" />

            {/* Main image */}
            <img
              className="relative w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[400px] 
               h-auto object-cover rounded-2xl shadow-md z-10"
              alt="Catering service showcase"
              src="https://c.animaapp.com/mhfz0577zdQtqk/img/image-72.png"
            />
          </motion.div>


          {/* --- Content Section --- */}
          <div className="flex flex-col items-start w-full lg:w-1/2 gap-6">
            <motion.div
              variants={fadeInUp(0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-[Satisfy] text-[#c2302e] text-2xl"
            >
              Why Choose Us
            </motion.div>

            <motion.h2
              variants={fadeInUp(0.3)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-roboto font-bold text-2xl sm:text-3xl md:text-4xl text-black leading-snug"
            >
              20 Years of Experience <br className="hidden sm:block" /> in
              Catering Service
            </motion.h2>

            <div className="flex flex-col items-start justify-center gap-6 w-full">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp(0.4 + index * 0.2)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="w-full"
                >
                  <Card className="w-full border-0 shadow-none bg-transparent">
                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 w-full p-0">
                      <div className="flex items-center justify-center p-3 bg-[#c2302e] rounded-[35px] flex-shrink-0 w-[70px] h-[70px]">
                        <img
                          className="w-[50px] h-[50px] object-contain"
                          alt={feature.title}
                          src={feature.icon}
                        />
                      </div>

                      <div className="flex flex-col items-start justify-center flex-1">
                        <h3 className="font-roboto font-semibold text-[#c2302e] text-xl sm:text-2xl md:text-3xl leading-normal">
                          {feature.title}
                        </h3>
                        <p className="font-roboto text-black text-base sm:text-lg md:text-xl leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>

  );
};
