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

            {/* Contact Section */}
            <section className="px-10 py-20 text-center">
                <h2 className="text-4xl font-serif mb-6">Get in Touch</h2>
                <p className="text-lg max-w-2xl mx-auto mb-12">
                    Have questions, custom orders, or special requests?
                    We’d love to hear from you. Reach out to us through the form below or visit our
                    boutique.
                </p>

                <form className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-[#d9c9a7]">
                    <div className="mb-5 text-left">
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full border border-[#d9c9a7] rounded-md px-4 py-2 focus:outline-none focus:border-[#b88c4a] bg-[#faf7f2]"
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="mb-5 text-left">
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full border border-[#d9c9a7] rounded-md px-4 py-2 focus:outline-none focus:border-[#b88c4a] bg-[#faf7f2]"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="mb-5 text-left">
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                            rows={4}
                            className="w-full border border-[#d9c9a7] rounded-md px-4 py-2 focus:outline-none focus:border-[#b88c4a] bg-[#faf7f2]"
                            placeholder="Write your message..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-[#b88c4a] text-white rounded-md text-lg hover:bg-[#a07a3c] transition-colors"
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
}
