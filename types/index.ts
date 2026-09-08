// ============================================================
// Domain types terpusat (Hijab Paradise)
// Dipakai oleh services, validations, dan route handlers.
// UI storefront memakai kontrak lama-nya sendiri.
// ============================================================

import type {
  OrderModel,
  OrderItemModel,
  ProductModel,
} from "@/app/generated/prisma/models";

export type Role = "user" | "admin";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ProductCategory =
  | "Hijab"
  | "Gamis"
  | "Tunik"
  | "Pashmina"
  | "Abaya"
  | "Jilbab"
  | "Aksesori";

// Re-export tipe Prisma (default selection) sebagai DTO respons.
export type ProductDto = ProductModel;
export type OrderDto = OrderModel;
export type OrderItemDto = OrderItemModel;

// ---------- Input / payload ----------

export interface RegisterUserInput {
  email: string;
  password: string;
  name?: string | null;
}

export interface AuthUserResult {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  image?: string | null;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description?: string | null;
  category: string;
  sizes?: string[];
  stock?: number;
  imageUrl?: string | null;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  size: string;
}

export interface CreateOrderInput {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  items: OrderItemInput[];
}

export interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}
