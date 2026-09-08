import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(72, "Password terlalu panjang"),
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama terlalu panjang")
    .optional()
    .nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
