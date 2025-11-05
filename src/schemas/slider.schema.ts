import { z } from "zod";

export const sliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  images: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Image is required",
    })
    .refine((file) => file instanceof File, {
      message: "Please upload a valid profile image",
    }),
  description: z.string().nullable().optional(),
  status: z.string().optional(),
});

export const editSliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  images: z.any().optional(),
  description: z.string().nullable().optional(),
  status: z.string().optional(),
});
