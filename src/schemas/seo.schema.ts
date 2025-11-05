import { z } from "zod";

export const seoZodSchema = z.object({
  orgid: z.number().int().optional(),
  type: z.string().max(250).nullable().optional(),
  page: z.string({ required_error: "Page is required" }).min(1, "Page name cannot be empty"),
  location: z.string({ required_error: "Location is required" })
    .min(1, "Location cannot be empty").url("Location must be a valid URL"),
  title: z.string({ required_error: "Title is required" }).min(1, "Title cannot be empty"),
  keyword: z.string().min(1, { message: "Keyword is required" })
    .refine((val) => val.replace(/<[^>]*>?/gm, "").trim().length > 0, { message: "Keyword cannot be empty" }),
  description: z.string().min(1, { message: "Description is required" })
    .refine((val) => val.replace(/<[^>]*>?/gm, "").trim().length > 0, { message: "Description cannot be empty" }),
  status: z.enum(["Y", "N"]).default("Y"),
  createdAt: z.coerce.date().default(new Date()),
  updatedAt: z.coerce.date().default(new Date()),
});