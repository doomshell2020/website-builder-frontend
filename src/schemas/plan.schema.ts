import { z } from "zod";

export const createPlanSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name should not exceed 255 characters"),
    price: z.string().min(1, "Price is required").max(255, "Price should not exceed 255 characters"),
    status: z.enum(["Y", "N"]).default("Y"),
});

export const updatePlanSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name should not exceed 255 characters").optional(),
    price: z.string().min(1, "Price is required").max(255, "Price should not exceed 255 characters").optional(),
    status: z.enum(["Y", "N"]).optional(),
});
