import { z } from "zod";

export const ClientLogoSchema = z.object({
  seq: z.union([
    z.string().min(1, "Order is required"),
    z.number().min(1, "Order is required"),
  ]).transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Order must be a valid number.",
    }),
  url: z.string().min(1, "URL is required").url("Must be a valid URL"),
  status: z.enum(["Y", "N"]).optional(),
  image: z.custom<File>((file) => file instanceof File && file.size > 0, {
    message: "Logo is required",
  }).refine((file) => file instanceof File, {
    message: "Please upload a valid logo.",
  }),
});

export const editClientLogoSchema = z.object({
  seq: z.union([
      z.string().min(1, "Order is required"),
      z.number().min(1, "Order is required"),
    ]).transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, {
      message: "Order must be a valid number.",
    }),
  url: z.string().min(1, "URL is required").url("Must be a valid URL"),
  status: z.enum(["Y", "N"]).optional(),
  image: z.any().optional(),
});
