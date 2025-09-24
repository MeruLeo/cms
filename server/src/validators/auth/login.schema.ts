import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(3, "Email or username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default loginSchema;
