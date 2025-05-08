import { z } from "zod";

export const editColumnSchema = z.object({
   name: z.string().min(3, "Name must be at least 3 characters long").max(26, "Name must be less than 26 characters"),
   color: z.string().refine((val) => val === "" || val?.length === 7, {
      message: "Color must be 7 characters long",
   }),
});
