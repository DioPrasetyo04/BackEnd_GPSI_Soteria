import { z } from "zod";
export const authSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Nama minimal 3 karakter" })
      .max(100, { message: "Nama maksimal 100 karakter" }),
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" })
      .regex(/[A-Z]/, {
        message: "Password harus mengandung minimal 1 huruf besar",
      })
      .regex(/[a-z]/, {
        message: "Password harus mengandung minimal 1 huruf kecil",
      })
      .regex(/[0-9]/, { message: "Password harus mengandung minimal 1 angka" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password harus mengandung minimal 1 karakter spesial",
      }),
  })
  .strict();
