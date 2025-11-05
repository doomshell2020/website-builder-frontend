"use client";

import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-gray-800">

            {/* Banner */}
            <section className="relative h-[75vh] flex items-center justify-center">
                <Image
                    src="/assest/image/textiles-collection-about6.jpg"
                    fill
                    alt="About Textile"
                    className="object-cover brightness-75"
                />
                <div className="relative z-10 text-white text-center">
                    <h1 className="text-5xl font-bold uppercase">About Us</h1>
                    <p className="mt-2 text-lg">Crafting Fabrics Since 1980</p>
                </div>
            </section>

            {/* About Content */}
            <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We started as a small family-owned textile workshop, driven by our
                        passion for crafting high-quality fabrics that define style and
                        comfort. Over the years, our brand has grown into a trusted name in
                        clothing and fabric manufacturing.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Today, we combine traditional craftsmanship with modern design,
                        ensuring that every product tells a story of precision, beauty, and
                        quality. From cotton to silk, we deliver excellence in every thread.
                    </p>
                </div>

                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src="/assest/image/textiles-collection-team1.jpg"
                        alt="Textile Team"
                        fill
                        className="object-cover"
                    />
                </div>
            </section>
            
        </main>
    );
};