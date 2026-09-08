import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatus } from "@/types";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "productId wajib diisi"),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "Jumlah minimal 1")
    .max(99, "Jumlah maksimal 99"),
  size: z.string().trim().min(1, "Ukuran wajib dipilih").max(30),
});

export const createOrderSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  name: z.string().trim().min(1, "Nama wajib diisi").max(120),
  phone: z.string().trim().min(6, "Nomor telepon tidak valid").max(20),
  address: z.string().trim().min(5, "Alamat terlalu pendek").max(500),
  city: z.string().trim().min(2, "Kota wajib diisi").max(120),
  postalCode: z.string().trim().min(3, "Kode pos tidak valid").max(10),
  items: z.array(orderItemSchema).min(1, "Keranjang masih kosong").max(50),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "orderId wajib diisi"),
  status: z.enum(ORDER_STATUSES as unknown as [OrderStatus, ...OrderStatus[]]),
});

export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusPayload = z.infer<typeof updateOrderStatusSchema>;
