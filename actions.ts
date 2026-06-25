"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addProduct(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string);
  const description = formData.get("description") as string;
  const category = (formData.get("category") as string) || "Hijab";
  const sizes = formData.getAll("sizes") as string[];
  const imageUrl = formData.get("imageUrl") as string;
  const stock = parseInt(formData.get("stock") as string) || 0;

  if (!name || !price) {
    throw new Error("Nama dan harga produk diperlukan");
  }

  await prisma.product.create({
    data: {
      name,
      price,
      description,
      category,
      sizes,
      image: imageUrl || null,
      imageBlob: imageUrl || null,
      stock,
      rating: 0,
      sold: 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function createOrder(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const postalCode = formData.get("postalCode") as string;
  const itemsJson = formData.get("items") as string;

  if (
    !email ||
    !name ||
    !phone ||
    !address ||
    !city ||
    !postalCode ||
    !itemsJson
  ) {
    throw new Error("Semua field harus diisi");
  }

  const items = JSON.parse(itemsJson);

  // Calculate total
  let total = 0;
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) {
      throw new Error(`Produk tidak ditemukan: ${item.productId}`);
    }
    total += product.price * item.quantity;
  }

  const session = await getServerSession(authOptions);

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id || null,
      email,
      name,
      phone,
      address,
      city,
      postalCode,
      status: "pending",
      total,
      items: {
        create: items.map(
          (item: {
            productId: string;
            quantity: number;
            size: string;
            price: number;
          }) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
          }),
        ),
      },
    },
  });

  // Update product sold count and stock
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        sold: { increment: item.quantity },
        stock: { decrement: item.quantity },
      },
    });
  }

  revalidatePath("/admin/dashboard");
  return order;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/dashboard");
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return products;
}
