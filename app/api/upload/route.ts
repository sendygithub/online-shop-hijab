import { NextRequest } from "next/server";
import { handleApiError, jsonOk, requireAdmin } from "@/lib/api/http";
import { uploadProductImage } from "@/lib/services/media.service";

// POST /api/upload — upload gambar produk ke Vercel Blob (khusus admin)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return jsonOk({ error: "File tidak ditemukan" }, 400);
    }

    const url = await uploadProductImage(file);
    return jsonOk({ url });
  } catch (error) {
    return handleApiError(error);
  }
}
