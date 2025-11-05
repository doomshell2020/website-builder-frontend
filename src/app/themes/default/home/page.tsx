"use client";

import { User } from "@/types/user";

interface DefaultHomeProps {
    project?: User;
};

export default function DefaultHome({ project }: DefaultHomeProps) {
    
    return (
        <main className="min-h-screen bg-gray-50 text-gray-800">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-20 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold drop-shadow">
                    Welcome to {project?.company_name || "Our Company"}
                </h1>
                <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
                    We provide powerful digital solutions to help your business grow and succeed.
                </p>

                <button className="mt-8 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow hover:bg-gray-200 transition">
                    Get Started
                </button>
            </section>

            {/* Services Section */}
            <section className="py-16 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Web Development",
                            desc: "We build modern, fast and secure web solutions for your business.",
                        },
                        {
                            title: "UI/UX Design",
                            desc: "Clean and user-friendly interfaces that improve conversion.",
                        },
                        {
                            title: "Brand Identity",
                            desc: "We help businesses create strong and memorable branding.",
                        },
                    ].map((service, i) => (
                        <div
                            key={i}
                            className="p-8 bg-white shadow rounded-xl border hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                            <p className="opacity-80">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gray-100 py-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Let’s Work Together</h2>
                <p className="opacity-75 max-w-xl mx-auto">
                    Want to build a digital presence that stands out? We’re here to help.
                </p>
                <button className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition">
                    Contact Us
                </button>
            </section>

        </main>
    );
};