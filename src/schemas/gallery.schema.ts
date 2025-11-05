import { z } from "zod";

export const GallerySchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    images: z
        .array(z.instanceof(File, { message: "Invalid image file" }))
        .min(1, { message: "Please select at least one image." })
        .max(20, { message: "You can upload up to 20 images only." }),
    description: z.string().nullable().optional(),
    status: z.string().optional(),
});

export const editGallerySchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().nullable().optional(),
    images: z
        .array(
            z
                .instanceof(File, { message: "Invalid image file" })
                .refine(
                    (file) =>
                        ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
                    { message: "Only JPG, JPEG, and PNG files are allowed." }
                )
        )
        .max(20, { message: "You can upload up to 20 images only." })
        .optional()
        .default([]),
    existingImages: z
        .array(z.string()) // existing images are filenames or URLs
        .optional()
        .default([]),
    status: z.string().optional(),
});
