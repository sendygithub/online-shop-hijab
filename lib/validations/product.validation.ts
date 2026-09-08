import { z } from "zod";
import { CATEGORIES } from "@/lib/constants";
import type { ProductCategory } from "@/types";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama produk wajib diisi")
    .max(200, "Nama produk terlalu panjang"),
  price: z.coerce
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .int("Harga harus bilangan bulat")
    .positive("Harga harus lebih dari 0"),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi wajib diisi")
    .max(2000, "Deskripsi terlalu panjang")
    .optional()
    .nullable(),
  category: z
    .enum(CATEGORIES as unknown as [ProductCategory, ...ProductCategory[]])
    .default("Hijab"),
  sizes: z
    .array(z.string().trim().min(1).max(30))
    .max(20, "Maksimal 20 varian ukuran")
    .default([]),
  stock: z.coerce.number().int().min(0).default(0),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .optional()
    .nullable(),
});

export type CreateProductPayload = z.infer<typeof createProductSchema>;
