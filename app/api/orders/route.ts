import { NextRequest } from "next/server";
import {
  ApiError,
  getSessionUser,
  handleApiError,
  jsonOk,
  requireAdmin,
} from "@/lib/api/http";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "@/lib/validations/order.validation";
import {
  createOrder,
  listOrders,
  updateOrderStatus,
} from "@/lib/services/order.service";

// GET /api/orders — daftar pesanan (khusus admin)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const orders = await listOrders();
    return jsonOk(orders);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/orders — buat pesanan baru (publik)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.parse(body);

    const userId = await getSessionUser(request).then((u) => u?.id ?? null);

    const order = await createOrder(parsed, userId);
    return jsonOk(order, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/orders — ubah status pesanan (khusus admin)
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const parsed = updateOrderStatusSchema.parse(body);

    const order = await updateOrderStatus(parsed);
    return jsonOk(order);
  } catch (error) {
    return handleApiError(error);
  }
}
