"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultHomeProps {
    project?: User;
};

export default function HousingLeadership({ project }: DefaultHomeProps) {
    const router = useRouter();

    const leadershipData = [
        {
            name: "Mr. Lovendra Choudhary",
            title: "MANAGING DIRECTOR",
            quote:
                "\"Success isn't just about how far we climb — it's about how solidly we lay the foundation. As a young builder with a visionary mindset, I believe that real growth starts with values, is guided by vision, and is anchored in trust. In construction, just like in life, if the base isn't strong, nothing lasting can rise. With purpose as our blueprint and perseverance as our tools, progress becomes more than a goal — it becomes inevitable.\"",
            image: "https://c.animaapp.com/miu4qofhUHi324/img/clint-img-1.svg",
            imagePosition: "left",
        },
        {
            name: "Mr. Aniket Choudhary",
            title: "DIRECTOR",
            quote:
                "\"Vision isn't just about having a clear image of the future. It's about believing so deeply in the future you dream of, that you're willing to wake up every day and chase it—no matter how far, no matter how hard. True vision is not passive sight, it's active faith. It's the fire that drives you forward when there's no map, only\npurpose.\"",
            image: "https://c.animaapp.com/miu4qofhUHi324/img/clint-img.svg",
            imagePosition: "right",
        },
    ];

    return (
        <section className="flex flex-col items-center justify-center relative w-full">
            <div className="flex h-[459px] items-center justify-center gap-2.5 relative w-full bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url(https://c.animaapp.com/miu4qofhUHi324/img/hero-leadsdership.png)] bg-[50%_50%] bg-cover">
                <div className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto] translate-y-[-1rem] animate-fade-in opacity-0">
                    <h1 className="w-fit font-poppinsregular-52 font-[number:var(--poppinsregular-52-font-weight)] text-[length:var(--poppinsregular-52-font-size)] relative mt-[-1.00px] text-white tracking-[var(--poppinsregular-52-letter-spacing)] leading-[var(--poppinsregular-52-line-height)] [font-style:var(--poppinsregular-52-font-style)]">
                        Our Leadership
                    </h1>
                </div>
            </div>

            <Card className="flex flex-col items-center justify-center gap-6 p-20 relative w-full flex-[0_0_auto] -mt-10 bg-white rounded-[40px_40px_0px_0px] border-0 shadow-none translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                <CardContent className="flex flex-col items-center justify-center gap-16 relative w-full p-0">
                    {leadershipData.map((leader, index) => (
                        <div
                            key={index}
                            className={`flex flex-wrap items-center justify-center gap-16 relative w-full translate-y-[-1rem] animate-fade-in opacity-0 ${index === 0
                                ? "[--animation-delay:400ms]"
                                : "[--animation-delay:600ms]"
                                }`}
                        >
                            {leader.imagePosition === "left" ? (
                                <>
                                    <img
                                        className="relative w-[416.07px] h-[453px] mb-[-11.91px] ml-[-13.00px]"
                                        alt={`${leader.name} portrait`}
                                        src={leader.image}
                                    />
                                    <div className="flex flex-col w-[812.93px] h-[317px] items-start justify-center gap-[17px] relative">
                                        <div className="flex flex-col items-start justify-center relative w-full flex-[0_0_auto]">
                                            <div className="flex items-center justify-center gap-2.5 relative w-full flex-[0_0_auto]">
                                                <h2 className="relative flex-1 mt-[-1.00px] font-poppins-34 font-[number:var(--poppins-34-font-weight)] text-[#201667] text-[length:var(--poppins-34-font-size)] tracking-[var(--poppins-34-letter-spacing)] leading-[var(--poppins-34-line-height)] [font-style:var(--poppins-34-font-style)]">
                                                    {leader.name}
                                                </h2>
                                            </div>
                                            <div className="flex items-start gap-2.5 relative w-full flex-[0_0_auto]">
                                                <p className="relative w-fit mt-[-1.00px] font-poppins-16 font-[number:var(--poppins-16-font-weight)] text-[#161212] text-[length:var(--poppins-16-font-size)] tracking-[var(--poppins-16-letter-spacing)] leading-[var(--poppins-16-line-height)] [font-style:var(--poppins-16-font-style)]">
                                                    {leader.title}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-2.5 relative w-full flex-[0_0_auto]">
                                            <p className="relative flex-1 mt-[-1.00px] font-poppinsregular-20 font-[number:var(--poppinsregular-20-font-weight)] text-[#141414] text-[length:var(--poppinsregular-20-font-size)] text-justify tracking-[var(--poppinsregular-20-letter-spacing)] leading-[var(--poppinsregular-20-line-height)] [font-style:var(--poppinsregular-20-font-style)]">
                                                {leader.quote}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col w-[812.93px] h-[317px] items-start justify-center gap-[17px] relative">
                                        <div className="flex flex-col items-start justify-center relative w-full flex-[0_0_auto]">
                                            <div className="flex items-center justify-center gap-2.5 relative w-full flex-[0_0_auto]">
                                                <h2 className="relative flex-1 mt-[-1.00px] font-poppins-34 font-[number:var(--poppins-34-font-weight)] text-[#201667] text-[length:var(--poppins-34-font-size)] tracking-[var(--poppins-34-letter-spacing)] leading-[var(--poppins-34-line-height)] [font-style:var(--poppins-34-font-style)]">
                                                    {leader.name}
                                                </h2>
                                            </div>
                                            <div className="flex items-start gap-2.5 relative w-full flex-[0_0_auto]">
                                                <p className="relative w-fit mt-[-1.00px] font-poppins-16 font-[number:var(--poppins-16-font-weight)] text-[#161212] text-[length:var(--poppins-16-font-size)] tracking-[var(--poppins-16-letter-spacing)] leading-[var(--poppins-16-line-height)] [font-style:var(--poppins-16-font-style)]">
                                                    {leader.title}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-2.5 relative w-full flex-[0_0_auto]">
                                            <p className="relative flex-1 mt-[-1.00px] font-poppinsregular-20 font-[number:var(--poppinsregular-20-font-weight)] text-[#141414] text-[length:var(--poppinsregular-20-font-size)] text-justify tracking-[var(--poppinsregular-20-letter-spacing)] leading-[var(--poppinsregular-20-line-height)] [font-style:var(--poppinsregular-20-font-style)]">
                                                {leader.quote}
                                            </p>
                                        </div>
                                    </div>
                                    <img
                                        className="relative w-[416.07px] h-[453px] mb-[-11.91px]"
                                        alt={`${leader.name} portrait`}
                                        src={leader.image}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    );
};