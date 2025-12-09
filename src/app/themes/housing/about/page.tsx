"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultProps { project?: User; };

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

  const missionVisionData = [
    {
      id: "mission",
      title: "Our Mission",
      image: "https://c.animaapp.com/miu4qofhUHi324/img/image-35.png",
      imagePosition: "left",
      content: [
        '"Our mission is to deliver innovative, highquality construction solutions that exceed expectations and stand the test of time. We are committed to building with integrity, leveraging advanced technologies, sustainable practices, and a skilled workforce to shape modern infrastructure that enhances communities, drives progress, and inspires future generations."',
      ],
    },
    {
      id: "vision",
      title: "Our Vision",
      image: "https://c.animaapp.com/miu4qofhUHi324/img/image-35-1.png",
      imagePosition: "right",
      content: [
        '"To build more than structures — to build trust, opportunity, and lasting impact. We envision a future where every project reflects integrity, innovation, and a commitment to sustainable progress. By combining modern construction techniques with timeless values, we aim to shape spaces that serve people today and empower generations to come."',
        '"To redefine skylines and shape the future of urban living by delivering world-class construction inspired by the bold ambition of cities like Dubai. Our vision is to be a driving force in modern infrastructure — creating landmark projects that blend innovation, sustainability, and visionary design. We aim to transform landscapes, elevate lifestyles, and leave a legacy of architectural excellence across the world."',
      ],
    },
  ];

  return (
    <div>

      <section className="flex flex-col items-center justify-center relative w-full">
        <div
          className="flex h-[459px] w-full relative items-center justify-center gap-2.5
    bg-[linear-gradient(0deg,rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('https://c.animaapp.com/miu4qofhUHi324/img/hero.png')] bg-cover bg-center">
          <div className="inline-flex items-center justify-center gap-2.5 translate-y-[-1rem] animate-fade-in opacity-0 relative">
            <h1
              className=" mt-[-1px] w-fit text-white font-poppinsregular-52 text-[length:var(--poppinsregular-52-font-size)] tracking-[var(--poppinsregular-52-letter-spacing)] leading-[var(--poppinsregular-52-line-height)]">
              About
            </h1>
          </div>
        </div>


        <div className="flex flex-col items-center justify-center gap-6 px-20 py-[85px] relative w-full -mt-10 bg-white rounded-[40px_40px_0px_0px]">
          <div className="flex flex-wrap items-start justify-center gap-[78px_78px] relative w-full">
            <img
              className="relative w-[576px] mt-[-44.00px] mb-[-4.00px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]"
              alt="Img dot box"
              src="https://c.animaapp.com/miu4qofhUHi324/img/img-dot-box.svg"
            />

            <div className="flex-col w-[681px] items-start gap-3.5 pt-[18px] pb-0 px-0 flex relative">
              <div className="flex flex-col items-start relative w-full">
                <div className="flex flex-col items-start justify-center gap-4 relative w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                  <div className="flex relative w-full items-center gap-2.5">
                    <h2 className="relative w-fit mt-[-1.00px] font-manrope-34 font-[number:var(--manrope-34-font-weight)] text-[#141414] text-[length:var(--manrope-34-font-size)] tracking-[var(--manrope-34-letter-spacing)] leading-[var(--manrope-34-line-height)] [font-style:var(--manrope-34-font-style)]">
                      Designing Spaces, Defining Futures
                    </h2>
                  </div>
                </div>

                <div className="inline-flex absolute top-[-43px] left-0 items-center gap-2.5 animate-fade-in opacity-0 [--animation-delay:300ms]">
                  <div className="relative w-[647px] mt-[-1.00px] font-manrope-66 font-[number:var(--manrope-66-font-weight)] text-[#00a4e521] text-[length:var(--manrope-66-font-size)] tracking-[var(--manrope-66-letter-spacing)] leading-[var(--manrope-66-line-height)] [font-style:var(--manrope-66-font-style)]">
                    OUR STORY
                  </div>
                </div>
              </div>

              <div className="items-center justify-center gap-2.5 pl-6 pr-0 py-2.5 w-full border-l-[3px] [border-left-style:solid] border-black flex relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:500ms]">
                <p className="relative flex-1 mt-[-3.00px] font-poppinsregular-22 font-[number:var(--poppinsregular-22-font-weight)] text-[#141414] text-[length:var(--poppinsregular-22-font-size)] text-justify tracking-[var(--poppinsregular-22-letter-spacing)] leading-[var(--poppinsregular-22-line-height)] [font-style:var(--poppinsregular-22-font-style)]">
                  At NAVVISTAR INFRA, we don&apos;t just construct buildings — we
                  build trust, opportunity, and a better tomorrow
                </p>
              </div>

              <div className="items-center justify-center gap-2.5 pl-0 pr-2.5 py-0 w-full border-0 border-none flex relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
                <p className="relative flex-1 font-poppinsregular-22 font-[number:var(--poppinsregular-22-font-weight)] text-[#141414] text-[length:var(--poppinsregular-22-font-size)] text-justify tracking-[var(--poppinsregular-22-letter-spacing)] leading-[var(--poppinsregular-22-line-height)] [font-style:var(--poppinsregular-22-font-style)]">
                  Founded on July 28, 2025, NAVVISTAR INFRA PVT. LTD. is a
                  visionary new construction company built on ambition,
                  innovation, and a commitment to excellence. We are more than
                  just builders — we are forward-thinkers with a clear mission to
                  shape the future of construction through smart design, quality
                  craftsmanship, and sustainable practices.
                </p>
              </div>

              <div className="items-center justify-center gap-2.5 pl-0 pr-2.5 py-0 w-full border-0 border-none flex relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:700ms]">
                <p className="relative flex-1 font-poppinsregular-22 font-[number:var(--poppinsregular-22-font-weight)] text-[#141414] text-[length:var(--poppinsregular-22-font-size)] text-justify tracking-[var(--poppinsregular-22-letter-spacing)] leading-[var(--poppinsregular-22-line-height)] [font-style:var(--poppinsregular-22-font-style)]">
                  Driven by a high vision, we aim to set new standards in the
                  industry by delivering modern, efficient, and long-lasting
                  structures that meet the evolving needs of our clients and
                  communities. Our team combines fresh ideas with technical
                  expertise to bring bold concepts to life — safely, on time, and
                  within budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#f0f0f0] px-6 py-16 md:px-20">
        <div className="flex flex-col gap-[68px]">
          {missionVisionData.map((section, index) => (
            <div
              key={section.id}
              className={`flex flex-wrap items-center justify-center gap-[38px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:${index * 200}ms]`}
            >
              {section.imagePosition === "left" && (
                <div className="w-full md:w-[403px] h-auto md:h-[406px] flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt={`${section.title} illustration`}
                    src={section.image}
                  />
                </div>
              )}

              <div
                className={`flex flex-col gap-[18px] w-full ${section.imagePosition === "left" ? "md:w-[839px]" : "md:w-[805px]"} ${section.imagePosition === "right" ? "py-5" : ""}`}
              >
                <div className="flex items-center justify-start w-full">
                  <h2 className="font-manrope-30 font-[number:var(--manrope-30-font-weight)] text-[#141414] text-[length:var(--manrope-30-font-size)] text-justify tracking-[var(--manrope-30-letter-spacing)] leading-[var(--manrope-30-line-height)] [font-style:var(--manrope-30-font-style)]">
                    {section.title}
                  </h2>
                </div>

                {section.content.map((paragraph, pIndex) => (
                  <div
                    key={pIndex}
                    className="flex items-center justify-start w-full"
                  >
                    <p className="font-poppinsregular-20 font-[number:var(--poppinsregular-20-font-weight)] text-[#141414] text-[length:var(--poppinsregular-20-font-size)] text-justify tracking-[var(--poppinsregular-20-letter-spacing)] leading-[var(--poppinsregular-20-line-height)] [font-style:var(--poppinsregular-20-font-style)]">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>

              {section.imagePosition === "right" && (
                <div className="w-full md:w-[437px] h-auto md:h-[447px] flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt={`${section.title} illustration`}
                    src={section.image}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};