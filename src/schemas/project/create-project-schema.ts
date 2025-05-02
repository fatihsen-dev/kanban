import { z } from "zod";

export const createProjectSchema = z.object({
   name: z.string().min(3, "Name must be at least 3 characters long").max(26, "Name must be less than 26 characters"),
});
