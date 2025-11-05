"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface DefaultHomeProps {
    project?: User;
};

export default function JewellersContact({ project }: DefaultHomeProps) {
    const router = useRouter();
    return (
        <div className="bg-[#faf7f2] text-[#3a2f1f] min-h-screen">

            {/* Banner */}
            <section className="relative h-[40vh] flex items-center justify-center">
                <Image
                    src="/assest/image/textiles-collection-contactus1.jpg"
                    fill
                    alt="Contactus Textile"
                    className="object-cover brightness-75"
                />
                <div className="relative z-10 text-white text-center">
                    <h1 className="text-4xl font-bold uppercase">Contact Us</h1>
                    <p className="mt-3 text-gray-300">We’d love to hear from you</p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
                <form className="bg-white rounded-xl shadow-lg p-8 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Name</label>
                        <input
                            name="name"
                            // value={form.name}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            // value={form.email}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Message</label>
                        <textarea
                            name="message"
                            rows={5}
                            // value={form.message}
                            // onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Send Message
                    </button>
                </form>

                {/* Contact Info */}
                <div className="mt-16">
                    <h3 className="text-2xl font-serif mb-4">Visit Our Boutique</h3>
                    <p className="text-lg">
                        {`📍 ${project?.address1}`}
                        <br />
                        {`✉️ ${project?.email}`}
                        <br />
                        {`☎️ ${project?.mobile_no}`}
                    </p>
                </div>
            </section>

        </div>
    );
};