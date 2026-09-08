import { prisma } from "@/lib/prisma";
import type { CreateProductInput } from "@/types";

// Daftar produk untuk storefront (publik).
export async function listProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Tambah produk baru (khusus admin — guard ada di route handler).
export async function createProduct(input: CreateProductInput) {
  const imageUrl = input.imageUrl?.trim() || null;

  return prisma.product.create({
    data: {
      name: input.name,
      price: input.price,
      description: input.description?.trim() || null,
      category: input.category,
      sizes: input.sizes ?? [],
      stock: input.stock ?? 0,
      image: imageUrl,
      imageBlob: imageUrl,
      rating: 0,
      sold: 0,
    },
  });
}
