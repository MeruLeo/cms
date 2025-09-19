import z from "zod";

const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "full name most be 3 char")
    .max(64, "full name max is 6"),
  username: z
    .string()
    .min(3, "username most be 3 char")
    .max(64, "username max is 6"),
  email: z.email(),
  password: z.string("password is required").min(8, "password most be 8 char"),
});

export default registerSchema;
