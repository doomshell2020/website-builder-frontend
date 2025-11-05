"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultHomeProps {
    project?: User;
};

export default function JewellersHome({ project }: DefaultHomeProps) {
    const router = useRouter();
    return (
        <div className="bg-[#faf7f2] text-[#3a2f1f]">
            {/* Hero Section */}
            <section className="flex flex-col items-center text-center py-24">
                <h2 className="text-5xl font-serif mb-4">Elegance That Shines</h2>
                <p className="text-lg max-w-xl mb-6">
                    Handcrafted jewellery made with precision, love, and tradition.
                </p>

                <Button
                    asChild
                    className="px-6 py-3 bg-[#b88c4a] text-white rounded-md text-lg hover:bg-[#a07a3c]"
                >
                    <Link href="/collections">
                        <span className="[font-family:'Manrope',Helvetica] font-medium text-white text-base tracking-[0] leading-[24.7px] whitespace-nowrap">
                            Explore Collections
                        </span>
                    </Link>
                </Button>
            </section>

            {/* Featured Collection */}
            <section id="collections" className="py-20 px-10">
                <h3 className="text-3xl font-serif mb-10 text-center">Featured Pieces</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            img: "/assest/image/jewellery1.jpg",
                            label: "Ring",
                        },
                        {
                            img: "/assest/image/jewellery2.jpg",
                            label: "Necklace",
                        },
                        {
                            img: "/assest/image/jewellery3.jpg",
                            label: "Bracelet",
                        },
                    ].map((item, i) => (
                        <div key={i} className="group relative rounded-xl overflow-hidden cursor-pointer" >
                            <Image
                                src={item.img}
                                alt={item.label}
                                width={500}
                                height={600}
                                className="object-cover h-[450px] w-full group-hover:scale-105 transition-all duration-500"
                            />
                            <div className={`absolute bottom-5 left-5 text-xl font-semibold drop-shadow-md ${i === 1 ? "text-white" : "text-black"}`}
                            > {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};