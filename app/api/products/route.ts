import { NextRequest } from "next/server";
import { handleApiError, jsonOk, requireAdmin } from "@/lib/api/http";
import { createProductSchema } from "@/lib/validations/product.validation";
import { createProduct, listProducts } from "@/lib/services/product.service";

// GET /api/products — daftar produk untuk storefront (publik)
export async function GET() {
  try {
    const products = await listProducts();
    return jsonOk(products);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/products — tambah produk (khusus admin)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const parsed = createProductSchema.parse(body);

    const product = await createProduct(parsed);
    return jsonOk(product, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
