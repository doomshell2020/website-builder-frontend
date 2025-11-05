"use client";

import Image from "next/image";
import Link from "next/link";

export default function CollectionPage() {
  const collections = [
    {
      id: 1,
      title: "Cotton Collection",
      image: "/assest/image/textiles-cotton-collection1.jpg",
      description: "Soft and breathable cotton wear for all seasons.",
    },
    {
      id: 2,
      title: "Silk Collection",
      image: "/assest/image/textiles-silk-collection1.jpg",
      description: "Luxurious silk fabrics for elegant occasions.",
    },
    {
      id: 3,
      title: "Linen Collection",
      image: "/assest/image/textiles-linen-collection1.jpg",
      description: "Lightweight and sustainable linen range.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-800">

      {/* Banner */}
      <section className="relative h-[75vh] flex items-center justify-center">
        <Image
          src="/assest/image/textiles-collection-banner5.jpg"
          alt="Collection Banner"
          fill
          className="object-cover brightness-75"
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold uppercase tracking-wide">
            Our Collections
          </h1>
          <p className="mt-3 text-lg">Discover premium fabrics and designs</p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
          >
            <div className="relative w-full h-64">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <Link
                href="#"
                className="text-blue-600 hover:underline font-medium"
              >
                View Products →
              </Link>
            </div>
          </div>
        ))}
      </section>

    </main>
  );
};