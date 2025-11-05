import { z } from "zod";
const indianMobileRegex = /^(\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/;

export const enquirySchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too Long not accepted."),
    email: z.string().nonempty("Email is required").email("Invalid email address").max(255),
    mobile: z.string().nonempty("Mobile is required").regex(indianMobileRegex, "Invalid mobile number"),
    subject: z.string().nonempty("Message is required"),
    // country: z.union([
    //     z.string({ invalid_type_error: "Country is required" }),
    //     z.string().regex(/^\d+$/, "Country is required").transform(Number),
    // ]).refine((val) => !!val, { message: "Country is required" }),
});

export type CreateEnquiry = z.infer<typeof enquirySchema>;