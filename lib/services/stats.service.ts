import { prisma } from "@/lib/prisma";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalOrders, revenueAgg, totalProducts, pendingOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "cancelled" } },
      }),
      prisma.product.count(),
      prisma.order.count({ where: { status: "pending" } }),
    ]);

  return {
    totalOrders,
    totalRevenue: revenueAgg._sum.total ?? 0,
    totalProducts,
    pendingOrders,
  };
}
