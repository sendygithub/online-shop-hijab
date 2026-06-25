import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch all orders (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Gagal mengambil pesanan" },
      { status: 500 },
    );
  }
}

// POST: Create a new order (public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, address, city, postalCode, items } = body;

    if (
      !email ||
      !name ||
      !phone ||
      !address ||
      !city ||
      !postalCode ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // Calculate total and validate products
    let total = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Produk dengan ID ${item.productId} tidak ditemukan` },
          { status: 404 },
        );
      }

      total += product.price * item.quantity;
    }

    // Get user session if logged in
    const session = await getServerSession(authOptions);

    // Create order
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
      include: {
        items: true,
      },
    });

    // Update product sold count
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          sold: { increment: item.quantity },
          stock: { decrement: item.quantity },
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Gagal membuat pesanan" },
      { status: 500 },
    );
  }
}

// PATCH: Update order status (admin only)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID dan status diperlukan" },
        { status: 400 },
      );
    }

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 },
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate pesanan" },
      { status: 500 },
    );
  }
}
