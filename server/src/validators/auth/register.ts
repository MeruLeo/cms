import z from "zod";

const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "full name must be at least 8 characters")
    .max(64, "full name max is 6"),
  username: z
    .string()
    .min(3, "username must be at least 8 characters")
    .max(64, "username max is 6"),
  email: z.email(),
  password: z
    .string("password is required")
    .min(8, "password must be at least 8 characters"),
});

export default registerSchema;
