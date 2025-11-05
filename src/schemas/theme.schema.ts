import { z } from "zod";

export const themeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["Y", "N"]).default("Y"),
});

export const editThemeSchema = z.object({
  name: z.string().min(2, "Name is required").optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["Y", "N"]).optional(),
});
