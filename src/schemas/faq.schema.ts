import { z } from "zod";

export const faqCategorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(200),
    slug: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["Y", "N"]).default("Y"),
    deleted: z.enum(["Y", "N"]).default("N"),
});

export type FAQCategoryFormType = z.infer<typeof faqCategorySchema>;

export const faqSchema = z.object({
    category_id: z.number().optional().nullable(),
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
    slug: z.string().optional(),
    status: z.enum(["Y", "N"]).default("Y"),
    deleted: z.enum(["Y", "N"]).default("N"),
});

export type FAQFormType = z.infer<typeof faqSchema>;
