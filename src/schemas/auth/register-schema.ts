import { z } from "zod";

export const registerSchema = z
   .object({
      name: z.string().min(3).max(50),
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8).max(50),
      confirmPassword: z.string().min(8).max(50),
   })
   .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
   });
