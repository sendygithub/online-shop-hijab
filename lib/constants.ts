import type { OrderStatus, ProductCategory } from "@/types";

// Kategori produk — wajib sinkron dengan filter di storefront.
export const CATEGORIES = [
  "Hijab",
  "Gamis",
  "Tunik",
  "Pashmina",
  "Abaya",
  "Jilbab",
  "Aksesori",
] as const satisfies readonly ProductCategory[];

export const ROLES = ["user", "admin"] as const;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const satisfies readonly OrderStatus[];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Menunggu",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

// Transisi status yang diizinkan. delivered & cancelled bersifat terminal.
export const ORDER_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
