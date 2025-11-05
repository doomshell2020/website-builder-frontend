"use client";

import Image from "next/image";
import { User } from "@/types/user";

interface DefaultHomeProps {
    project?: User;
};


export default function ClothingHome({ project }: DefaultHomeProps) {
    const storeName = project?.company_name || "Clothing Store";
    return (
        <div className="min-h-screen bg-white text-gray-800">

            {/* Hero */}
            <section className="relative h-[75vh] flex items-center justify-center">
                <Image
                    src="/assest/image/bg-fashion.jpg"
                    fill
                    alt="Clothing Fashion Banner"
                    className="object-cover brightness-[0.7]"
                />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl font-extrabold text-white tracking-wider drop-shadow-xl uppercase">
                        {storeName}
                    </h1>
                    <p className="mt-3 text-lg text-gray-200 drop-shadow-md">
                        Your Style • Your Identity
                    </p>
                    <button className="mt-6 px-6 py-3 bg-white text-black rounded-lg shadow hover:bg-black hover:text-white transition">
                        Shop Now
                    </button>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-10 uppercase tracking-wide">
                    New Arrivals
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {[
                        {
                            img: "/assest/image/fashion1.jpg",
                            label: "Casual Collection",
                        },
                        {
                            img: "/assest/image/fashion2.jpg",
                            label: "Premium Men Fits",
                        },
                        {
                            img: "/assest/image/fashion3.jpg",
                            label: "Women's Fashion",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="group relative rounded-xl overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={item.img}
                                alt={item.label}
                                width={500}
                                height={600}
                                className="object-cover h-[450px] w-full group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute bottom-5 left-5 text-xl font-semibold text-white drop-shadow-md">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Promo Banner */}
            <section className="relative py-20 text-center bg-gray-900 text-white">
                <h3 className="text-3xl font-bold">Season Sale is Live!</h3>
                <p className="mt-3 text-gray-300">Flat 30% Off on Select Collections</p>
                <button className="mt-6 px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition">
                    Grab Offer
                </button>
            </section>

        </div>
    );
};
