import Image from "next/image";
import Link from "next/link";

const collections = [
    {
        id: 1,
        title: "Gold Necklaces",
        image: "/assest/image/jewellery-collection-gold-set-1.jpg",
        description: "Elegance and heritage combined in every necklace.",
    },
    {
        id: 2,
        title: "Diamond Rings",
        image: "/assest/image/jewellery-collection-diamond-ring-1.jpg",
        description: "Shine brighter with our diamond ring collection.",
    },
    {
        id: 3,
        title: "Earrings",
        image: "/assest/image/jewellery-collection-earrings-1.jpg",
        description: "Beautifully crafted earrings for every occasion.",
    },
    {
        id: 4,
        title: "Bridal Sets",
        image: "/assest/image/jewellery-collection-bridal-set3.jpg",
        description: "A perfect ensemble for your special day.",
    },
];

export default function CollectionPage() {
    return (
        <main className="min-h-screen bg-white text-gray-800">
            {/* Hero Section */}
            <section className="relative w-full h-[60vh]">
                <Image
                    src="/assest/image/jewellery-collection-banner1.jpg"
                    alt="Tanishq Collections"
                    fill
                    className="object-cover brightness-90"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-3">Our Collections</h1>
                    <p className="text-lg md:text-xl">Timeless designs for every occasion</p>
                </div>
            </section>

            {/* Collections Grid */}
            <section className="max-w-6xl mx-auto px-4 py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {collections.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
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
                                href={`/site/tanishq-jewellers/collection/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                                className="text-[#B8860B] hover:text-[#A67C00] font-medium"
                            >
                                Explore Collection →
                            </Link>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}
