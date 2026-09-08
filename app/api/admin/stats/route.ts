import { NextRequest } from "next/server";
import { handleApiError, jsonOk, requireAdmin } from "@/lib/api/http";
import { getDashboardStats } from "@/lib/services/stats.service";

// GET /api/admin/stats — statistik dashboard (khusus admin)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const stats = await getDashboardStats();
    return jsonOk(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
