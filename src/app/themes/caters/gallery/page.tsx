"use client";

import React from 'react'

export default function Gallery() {
    return (
        <div> Gallery </div>
    )
}


// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Loader from "@/components/ui/loader";
// import { findGalleryBySlug } from "@/services/gallery.service";
// import { User } from "@/types/user";
// import { motion, Variants } from "framer-motion";

// interface DefaultProps { project?: User; }

// export default function Gallery({ project }: DefaultProps) {
//     const router = useRouter();
//     const [loading, setLoading] = useState(true);
//     const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//     const fallbackImages = [
//         "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-8.png",
//         "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-9.png",
//         "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-10.png",
//         "https://navlokcolonizers.com/wp-content/uploads/2025/08/sliderBnr-2-1024x373.jpg",
//         "https://navlokcolonizers.com/wp-content/uploads/2025/08/sliderBnr-3-1024x373.jpg",
//         "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-13.png",
//         "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-14.png",
//         "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-15.png",
//         "https://c.animaapp.com/mhd81w7aWvI44g/img/image-5-16.png",
//     ];

//     useEffect(() => {
//         const fetchGalleryImages = async () => {
//             if (!project?.company_name) {
//                 setImagePreviews(fallbackImages);
//                 setLoading(false);
//                 return;
//             }
//             setLoading(true);
//             try {
//                 const res: any = await findGalleryBySlug(project.company_name, "gallery");
//                 const data = res?.result || res;
//                 let imgs: string[] = [];
//                 if (data?.images) {
//                     const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
//                     const safeBase = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";

//                     if (Array.isArray(data.images)) {
//                         imgs = data.images.map((p: string) =>
//                             p.startsWith("http") ? p : `${safeBase}${p}`
//                         );
//                     } else if (typeof data.images === "string" && data.images.trim().length > 0) {
//                         try {
//                             const parsed = JSON.parse(data.images);
//                             if (Array.isArray(parsed)) {
//                                 imgs = parsed.map((p: string) =>
//                                     p.startsWith("http") ? p : `${safeBase}${p}`
//                                 );
//                             } else {
//                                 imgs = [parsed.startsWith("http") ? parsed : `${safeBase}${parsed}`];
//                             }
//                         } catch {
//                             imgs = [
//                                 data.images.startsWith("http")
//                                     ? data.images
//                                     : `${safeBase}${data.images}`,
//                             ];
//                         }
//                     }
//                 }
//                 setImagePreviews(imgs.length > 0 ? imgs : fallbackImages);
//             } catch (error) {
//                 console.error("❌ Error loading gallery:", error);
//                 setImagePreviews(fallbackImages);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchGalleryImages();
//     }, [project]);

//     const containerVariants: Variants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: { staggerChildren: 0.15 },
//         },
//     };

//     const itemVariants: Variants = {
//         hidden: { opacity: 0, y: 40 },
//         visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
//     };

//     return (
//         <div className="flex flex-col items-center w-full bg-white">
//             {/* Banner Section */}
//             <section className="relative flex w-full h-[469px] items-center justify-center overflow-hidden">
//                 <img
//                     src="https://c.animaapp.com/mhd81w7aWvI44g/img/frame-1000004029.png"
//                     alt="Gallery Background"
//                     className="absolute inset-0 w-full h-full object-cover object-center"
//                 />
//                 <div className="absolute inset-0 bg-[rgba(0,0,0,0.58)]" />
//                 <motion.h1
//                     initial={{ opacity: 0, y: 40 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.8, delay: 0.2 }}
//                     className="relative z-10 text-white text-4xl font-medium font-[Manrope]"
//                 >
//                     Gallery
//                 </motion.h1>
//             </section>

//             {/* Gallery Section */}
//             {loading ? (<div className="min-h-[420px] flex items-center justify-center"><Loader /></div>) : (
//                 <section className="flex flex-col items-center justify-center gap-8 bg-gray-200 px-6 py-[60px] w-full">
//                     <motion.header
//                         initial={{ opacity: 0, y: -20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.8, ease: "easeOut" }}
//                         viewport={{ once: true }}
//                         className="flex flex-col items-center text-center"
//                     >
//                         <h3 className="font-semibold text-[#00a4e5] text-lg font-[Manrope]">
//                             OUR GALLERY
//                         </h3>
//                         <h2 className="font-normal text-black text-xl sm:text-2xl font-[Manrope]">
//                             Explore Our Work
//                         </h2>
//                     </motion.header>

//                     {/* Gallery Grid */}
//                     <motion.div
//                         className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 px-6 sm:px-10 md:px-16 lg:px-20 w-full max-w-[1300px]"
//                         variants={containerVariants}
//                         initial="hidden"
//                         whileInView="visible"
//                         viewport={{ once: true, amount: 0.2 }}
//                     >
//                         {imagePreviews.map((image, index) => {
//                             const imageUrl = typeof image === "string" ? image : URL.createObjectURL(image);

//                             const handleDownload = async () => {
//                                 try {
//                                     const response = await fetch(imageUrl, { mode: "cors" });
//                                     const blob = await response.blob();
//                                     const blobUrl = URL.createObjectURL(blob);
//                                     const link = document.createElement("a");
//                                     const filename =
//                                         imageUrl.split("/").pop()?.split("?")[0] || `image-${index + 1}.jpg`;
//                                     link.href = blobUrl;
//                                     link.download = filename;
//                                     link.click();
//                                     URL.revokeObjectURL(blobUrl);
//                                 } catch (err) {
//                                     console.error("Download failed:", err);
//                                 }
//                             };
//                             // const handleShare = async () => {
//                             //     if (navigator.share) {
//                             //         try {
//                             //             await navigator.share({
//                             //                 title: `image-${index + 1}.jpg`,
//                             //                 text: "Check out this image!",
//                             //                 url: image,
//                             //             });
//                             //         } catch (err) {
//                             //             console.error("Error sharing:", err);
//                             //         }
//                             //     } else {
//                             //         await navigator.clipboard.writeText(image);
//                             //         alert("Image link copied to clipboard!");
//                             //     }
//                             // };

//                             return (
//                                 <motion.div
//                                     key={`${image}-${index}`}
//                                     variants={itemVariants}
//                                     className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md"
//                                 >
//                                     <img
//                                         src={imageUrl}
//                                         alt={`image-${index}`}
//                                         className="w-full h-[260px] object-cover rounded-xl bg-gray-50 transition-transform duration-500 group-hover:scale-105"
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
//                                         <button
//                                             onClick={handleDownload}
//                                             className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
//                                             aria-label="Download image"
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 strokeWidth={2}
//                                                 stroke="white"
//                                                 className="w-6 h-6"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
//                                                 />
//                                             </svg>
//                                         </button>

//                                         {/* Share Button */}
//                                         <button
//                                             // onClick={handleShare}
//                                             className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
//                                             aria-label="Share image"
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 strokeWidth={2}
//                                                 stroke="white"
//                                                 className="w-6 h-6"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
//                                                 />
//                                             </svg>
//                                         </button>
//                                     </div>
//                                 </motion.div>
//                             );
//                         })}
//                     </motion.div>
//                 </section>
//             )}
//         </div>
//     );
// };