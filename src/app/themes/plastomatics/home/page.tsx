"use client";

import Image from "next/image";
import { User } from "@/types/user";

interface DefaultHomeProps {
    project?: User;
};

export default function PlastomaticsHome({ project }: DefaultHomeProps) {
    const companyName = project?.company_name || "Plastomatics Industries";

    return (
        <div className="bg-white text-gray-800">

            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center bg-gray-200">
                <Image
                    src="/assest/image/bg-plastomatics2.jpg"
                    fill
                    alt="Plastic Manufacturing"
                    className="object-cover opacity-75"
                />
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg uppercase">
                        {companyName}
                    </h1>
                    <p className="mt-4 text-lg text-gray-200 drop-shadow">
                        High-Quality Injection Molded Plastic Components
                    </p>
                    <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        View Products
                    </button>
                </div>
            </section>

            {/* About / Intro */}
            <section className="py-16 px-6 max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
                <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                    We specialize in the manufacturing of high-quality plastic molded products
                    for industrial and commercial applications. With advanced technology and
                    precision engineering, we ensure durability and performance in every item we produce.
                </p>
            </section>

            {/* Product Highlights */}
            <section className="py-12 bg-gray-100">
                <h2 className="text-3xl font-bold text-center mb-10">Our Key Products</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">

                    {[
                        {
                            img: "/assest/image/plastomatics1.jpg",
                            label: "Plastic Components",
                        },
                        {
                            img: "/assest/image/plastomatics2.jpg",
                            label: "Industrial Parts",
                        },
                        {
                            img: "/assest/image/plastomatics3.jpg",
                            label: "Custom Molding",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 text-center cursor-pointer"
                        >
                            <Image
                                src={item.img}
                                width={400}
                                height={260}
                                alt={item.label}
                                className="rounded-lg object-cover h-[230px] w-full"
                            />
                            <h3 className="mt-4 text-lg font-semibold">{item.label}</h3>
                        </div>
                    ))}

                </div>
            </section>

            {/* Call To Action */}
            <section className="py-16 text-center bg-blue-600 text-white">
                <h3 className="text-3xl font-semibold">Looking For Bulk Orders?</h3>
                <p className="mt-2 opacity-90">We manufacture and supply at industry scale.</p>
                <button className="mt-6 px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-200 transition">
                    Contact Us
                </button>
            </section>
        </div>
    );
};