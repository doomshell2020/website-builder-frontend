"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGalleryById } from "@/services/gallery.service";
import { MoveLeft, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Loader from "@/components/ui/loader";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ViewGallery() {
    const router = useRouter();
    const { id } = useParams();
    const [gallery, setGallery] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleBack = () => router.back();

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res: any = await getGalleryById(id as string);

            // ✅ FIX: Extract `result` from API response
            if (res?.status && res?.result) {
                setGallery(res.result);
            } else {
                setGallery(null);
            }
        } catch (err) {
            console.error("Error fetching gallery:", err);
            setGallery(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [id, fetchData]);

    const images = Array.isArray(gallery?.images) ? gallery.images : [];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow border-b">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
                    <Button
                        onClick={handleBack}
                        className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 hover:bg-blue-700 rounded-[5px] font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        aria-label="Go back"
                    >
                        <MoveLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-800">Image Gallery</h1>
                </div>
            </header>

            {/* Main Content */}
            <div className="relative flex-grow max-w-6xl mx-auto w-full p-4">
                {loading ? (
                    <Loader />
                ) : !gallery ? (
                    <p className="text-center text-gray-500 mt-10">No gallery found.</p>
                ) : (
                    <motion.main
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white shadow-lg rounded-xl p-6"
                    >
                        {/* Gallery Info */}
                        <div className="mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{gallery.title}</h2>
                            <p className="text-gray-600">{gallery.description || "No description provided."}</p>
                        </div>

                        {/* Images Grid */}
                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {images.map((img: string, index: number) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.03 }}
                                        className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md"
                                        onClick={() => setSelectedImage(`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`)}
                                    >
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                                            alt={`Gallery Image ${index + 1}`}
                                            width={300}
                                            height={200}
                                            className="object-cover w-full h-40 transition-transform duration-300 group-hover:scale-110"
                                        />
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-medium">
                                            Click to View
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center mt-6">No images available.</p>
                        )}
                    </motion.main>
                )}

                {/* Full Image Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                        >
                            <div className="relative max-w-4xl w-full max-h-[90vh]">
                                <Image
                                    src={selectedImage}
                                    alt="Full View"
                                    width={1000}
                                    height={700}
                                    className="object-contain w-full h-auto rounded-lg"
                                />
                                <Button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-3 right-3 bg-white/90 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
