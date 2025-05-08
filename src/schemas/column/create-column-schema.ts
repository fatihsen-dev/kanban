import { z } from "zod";

export const createColumnSchema = z.object({
   name: z.string().min(3, "Name must be at least 3 characters long").max(26, "Name must be less than 26 characters"),
   color: z
      .string()
      .min(7, "Color must be at least 7 characters long")
      .max(7, "Color must be less than 7 characters")
      .optional(),
});
