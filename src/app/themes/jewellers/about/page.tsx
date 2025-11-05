"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultHomeProps {
    project?: User;
};

export default function JewellersAbout({ project }: DefaultHomeProps) {
    const router = useRouter();
    return (
        <div className="bg-[#faf7f2] text-[#3a2f1f] min-h-screen">
            {/* About Section */}
            <section className="px-10 py-20 text-center md:text-left">
                <h2 className="text-4xl font-serif mb-6 text-center">Our Story</h2>
                <p className="max-w-3xl mx-auto text-lg leading-relaxed">
                    Founded in 1985, <strong>Golden Jewellers</strong> has become a symbol of
                    timeless beauty and craftsmanship. Each piece of jewellery we design tells a
                    story of tradition, elegance, and passion for artistry. Our journey began in a
                    small artisan workshop where goldsmiths poured their hearts into creating
                    intricate pieces — and today, we proudly continue that legacy.
                </p>

                <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
                    <img
                        src="/assest/image/jewellery_about.jpg"
                        alt="About Golden Jewellers"
                        className="rounded-xl shadow-md object-cover w-full h-[600px]"
                    />
                    <div>
                        <h3 className="text-2xl font-serif mb-4">Our Promise</h3>
                        <p className="text-lg leading-relaxed">
                            We believe in authenticity, ethical sourcing, and excellence. Every gem,
                            every cut, and every polish is done with precision to ensure that your
                            jewellery is not just an accessory but an expression of who you are.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}