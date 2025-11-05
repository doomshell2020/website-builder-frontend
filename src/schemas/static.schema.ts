import { z } from "zod";

export const cmsStaticSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required.").max(255, "Title must be at most 255 characters"),
  url: z.string().min(1, "URL is required"),
  image: z.any().optional().refine((file) => !file || file instanceof File, {
    message: "Please upload a valid image",}),
  content: z.string().min(1, { message: "Content is required" })
    .refine((val) => val.replace(/<[^>]*>?/gm, "").trim().length > 0, { message: "Content is required" }),
  status: z.enum(["Y", "N"]).optional(),
});

export const editStaticSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required.").max(255, "Title must be at most 255 characters"),
  url: z.string().min(1, "URL is required"),
  image: z.any().optional().refine((file) => !file || file instanceof File, {
    message: "Please upload a valid image",}),
  content: z.string().min(1, { message: "Content is required" })
    .refine((val) => val.replace(/<[^>]*>?/gm, "").trim().length > 0, {message: "Content is required",}),
  status: z.enum(["Y", "N"]).optional(),
});
