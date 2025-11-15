import { z } from "zod";

const indianMobileRegex = /^(\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/;
const indianLandlineRegex = /^(\+91[\-\s]?|0)?\d{2,4}[\-\s]?\d{6,8}$/;

export const userSchema = z.object({
    id: z.number().optional(),
    name: z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z.string({ required_error: "Name is required" })
            .min(2, { message: "Name must be at least 2 characters" })
            .max(50, { message: "Name must be at most 50 characters" })
    ),
    email: z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z.string({ required_error: "Email is required" })
            .email({ message: "Invalid email address" })
            .max(100, { message: "Email must be at most 100 characters" })
            .refine((val) => {
                if (!val) return false;
                // Extract domain extension after last dot
                const domain = val.split(".").pop()?.toLowerCase();
                return domain ? allowedDomains.includes(domain) : false;
            }, { message: "Email must end with a valid domain (e.g., .com, .in)" })
    ),
    mobile_no: z.string().nonempty("Mobile is required").regex(indianMobileRegex, "Invalid mobile number"),
    office_no: z.string().optional().nullable().or(z.literal("")).refine((val) => {
        if (!val) return true; // allow empty

        // Split by commas and trim
        const numbers = val.split(",").map((n) => n.trim());

        // Max 4 numbers
        if (numbers.length > 4) return false;

        // All numbers must match regex
        return numbers.every((num) => indianLandlineRegex.test(num));
    }, {
        message: "Enter up to 4 valid Indian landline numbers, comma-separated",
    }),
    fax_no: z.string().optional().nullable().or(z.literal("")).refine((val) => {
        if (!val) return true; // allow empty

        // Split by commas and trim
        const numbers = val.split(",").map((n) => n.trim());

        // Max 4 numbers
        if (numbers.length > 4) return false;

        // All numbers must match regex
        return numbers.every((num) => indianLandlineRegex.test(num));
    }, {
        message: "Enter up to 4 valid Indian landline numbers, comma-separated",
    }),
    company_logo: z
        .any()
        .optional()
        .refine(
            (file) =>
                !file ||
                (file instanceof File && file.size > 0),
            { message: "Please upload a valid company logo" }
        ),
    status: z.union([z.literal("Y"), z.literal("N")]).optional(),
    fburl: z.string().url("Invalid Facebook URL").nullable().optional().or(z.literal("")),
    xurl: z.string().url("Invalid Twitter URL").nullable().optional().or(z.literal("")),
    linkedinurl: z.string().url("Invalid LinkedIn URL").nullable().optional().or(z.literal("")),
    instaurl: z.string().url("Invalid Instagram URL").nullable().optional().or(z.literal("")),
    yturl: z.string().url("Invalid Youtube URL").nullable().optional().or(z.literal("")),
    gstin: z.string().trim().nullable().optional(),
    address1: z.string({ required_error: "Address is required" }).nonempty("Address is required")
        .min(6, "Address is too short"), // handles short input
    address2: z.string().nullable(),
    // company_name: z.string({ required_error: "Company name is required" }).nonempty("Company is required"),
    // schema_name: z.string().nonempty("DB name is required"),
    // subdomain: z.string().nonempty("Sub-domain is required"),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    company_name: z.string().optional(),
});

const allowedDomains = ["com", "net", "org", "info", "biz", "xyz", "in", "co.in", "ac.in", "gov.in",
    "edu", "io", "ai", "tech", "app", "dev", "online", "store", "website", "me", "club", "pro"
];

export const addUserSchema = z.object({
    id: z.number().optional(),
    name: z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z.string({ required_error: "Name is required" })
            .min(2, { message: "Name must be at least 2 characters" })
            .max(50, { message: "Name must be at most 50 characters" })
    ),
    email: z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z.string({ required_error: "Email is required" })
            .email({ message: "Invalid email address" })
            .max(100, { message: "Email must be at most 100 characters" })
            .refine((val) => {
                if (!val) return false;
                // Extract domain extension after last dot
                const domain = val.split(".").pop()?.toLowerCase();
                return domain ? allowedDomains.includes(domain) : false;
            }, { message: "Email must end with a valid domain (e.g., .com, .in)" })
    ),
    password: z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z
            .string({ required_error: "Password is required" })
            .min(6, { message: "Password must be at least 6 characters" })
            .max(32, { message: "Password must be at most 32 characters" })
            // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            // .regex(/[0-9]/, { message: "Password must contain at least one number" })
            // .regex(/[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\:\'\"\<\>\,\.\?\/\\|`~]/, {
            //     message: "Password must contain at least one special character"
            // })
            .trim()
    ),
    mobile_no: z.string().nonempty("Mobile no. is required").regex(indianMobileRegex, "Invalid mobile number"),
    office_no: z.string().optional().nullable().or(z.literal("")).refine((val) => {
        if (!val) return true; // allow empty

        // Split by commas and trim
        const numbers = val.split(",").map((n) => n.trim());

        // Max 4 numbers
        if (numbers.length > 4) return false;

        // All numbers must match regex
        return numbers.every((num) => indianLandlineRegex.test(num));
    }, {
        message: "Enter up to 4 valid Indian landline numbers, comma-separated",
    }),
    fax_no: z.string().optional().nullable().or(z.literal("")).refine((val) => {
        if (!val) return true; // allow empty

        // Split by commas and trim
        const numbers = val.split(",").map((n) => n.trim());

        // Max 4 numbers
        if (numbers.length > 4) return false;

        // All numbers must match regex
        return numbers.every((num) => indianLandlineRegex.test(num));
    }, {
        message: "Enter up to 4 valid Indian landline numbers, comma-separated",
    }),
    status: z.union([z.literal("Y"), z.literal("N")]).optional(),
    website_type: z.coerce
        .number()
        .min(1, { message: "Company theme is required. Please select a theme" }),
    // image: z.any().optional().refine(
    //     (file) =>
    //         !file || (file instanceof File && file.size > 0),
    //     { message: "Please upload a valid profile image" }
    // ),
    company_logo: z.custom<File>((file) => file instanceof File && file.size > 0, {
        message: "Company logo is required",
    }).refine((file) => file instanceof File, {
        message: "Please upload a valid company logo",
    }),
    fburl: z.string().url("Invalid facebook url").nullable().optional().or(z.literal("")),
    xurl: z.string().url("Invalid twitter url").nullable().optional().or(z.literal("")),
    linkedinurl: z.string().url("Invalid linkedIn url").nullable().optional().or(z.literal("")),
    instaurl: z.string().url("Invalid instagram url").nullable().optional().or(z.literal("")),
    yturl: z.string().url("Invalid youtube url").nullable().optional().or(z.literal("")),
    address1: z.string({ required_error: "Address is required" }).nonempty("Current address is required")
        .min(6, "Address is too short"), // handles short input
    address2: z.string().nullable(),
    gstin: z.string().trim().nullable().optional(),
    company_name: z.string().nonempty("Company name is required"),
    subdomain: z.string().nonempty("Company sub-domain is required"),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

export const updateUserSchema = addUserSchema.partial().extend({
    company_logo: z
        .any()
        .optional()
        .refine(
            (file) =>
                !file ||
                (file instanceof File && file.size > 0),
            { message: "Please upload a valid company logo" }
        ),
    subdomain: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
