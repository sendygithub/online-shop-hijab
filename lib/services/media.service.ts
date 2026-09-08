import { put } from "@vercel/blob";
import { ApiError } from "@/lib/api/http";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Upload gambar produk ke Vercel Blob (khusus admin).
export async function uploadProductImage(file: File): Promise<string> {
  if (!file) throw new ApiError("File tidak ditemukan", 400);

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new ApiError(
      "Tipe file harus gambar (JPG, PNG, WebP, atau GIF)",
      400,
    );
  }
  if (file.size > MAX_SIZE) {
    throw new ApiError("Ukuran gambar maksimal 5MB", 400);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const blob = await put(`products/${Date.now()}-${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return blob.url;
}
