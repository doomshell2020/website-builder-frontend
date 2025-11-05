// schemas/authSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).refine(val => val.endsWith('.com'), {
    message: "Email must end with .com"
  }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;