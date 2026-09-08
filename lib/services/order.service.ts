import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api/http";
import { ORDER_FLOW } from "@/lib/constants";
import type {
  CreateOrderInput,
  OrderStatus,
  UpdateOrderStatusInput,
} from "@/types";

interface LineItem {
  productId: string;
  quantity: number;
  size: string;
  price: number;
  productName: string;
}

const orderInclude = {
  items: {
    include: {
      product: { select: { name: true, image: true } },
    },
  },
} as const;

// Buat pesanan (publik). Harga SELALU dihitung ulang dari database —
// nilai price dari client diabaikan. Stok diverifikasi & dikurangi
// secara atomik di dalam transaksi.
export async function createOrder(
  input: CreateOrderInput,
  userId: string | null,
) {
  const productIds = [...new Set(input.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  const lineItems: LineItem[] = input.items.map((item) => {
    const product = productById.get(item.productId);
    if (!product) {
      throw new ApiError(
        `Produk tidak ditemukan (${item.productId})`,
        404,
      );
    }
    if (item.quantity > product.stock) {
      throw new ApiError(
        `Stok "${product.name}" tidak mencukupi (sisa ${product.stock})`,
        400,
      );
    }
    return {
      productId: product.id,
      quantity: item.quantity,
      size: item.size,
      price: product.price,
      productName: product.name,
    };
  });

  const total = lineItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    // Kurangi stok + tambah sold dengan guard anti race-condition.
    for (const line of lineItems) {
      const result = await tx.product.updateMany({
        where: { id: line.productId, stock: { gte: line.quantity } },
        data: {
          stock: { decrement: line.quantity },
          sold: { increment: line.quantity },
        },
      });
      if (result.count === 0) {
        throw new ApiError(
          `Stok "${line.productName}" tidak mencukupi`,
          400,
        );
      }
    }

    return tx.order.create({
      data: {
        userId,
        email: input.email.toLowerCase().trim(),
        name: input.name,
        phone: input.phone,
        address: input.address,
        city: input.city,
        postalCode: input.postalCode,
        status: "pending",
        total,
        items: {
          create: lineItems.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            size: line.size,
            price: line.price,
          })),
        },
      },
      include: orderInclude,
    });
  });

  return order;
}

// Daftar pesanan lengkap untuk dashboard admin.
export async function listOrders() {
  return prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

// Ubah status pesanan (admin). Batal => stok & sold dikembalikan.
export async function updateOrderStatus(input: UpdateOrderStatusInput) {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: { items: true },
  });
  if (!order) throw new ApiError("Pesanan tidak ditemukan", 404);

  const current = order.status as OrderStatus;
  if (current === input.status) return order;

  const allowedNext = ORDER_FLOW[current] ?? [];
  if (!allowedNext.includes(input.status)) {
    throw new ApiError(
      `Status tidak bisa diubah dari "${current}" ke "${input.status}"`,
      400,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: input.status },
    });

    // Batalkan pesanan => kembalikan stok, kurangi angka sold.
    if (input.status === "cancelled") {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            sold: { decrement: item.quantity },
          },
        });
      }
    }
  });

  return prisma.order.findUnique({
    where: { id: order.id },
    include: orderInclude,
  });
}
