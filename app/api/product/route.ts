import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const newItem = await prisma.product.create({
    data: {
      name: body.name,
      category: body.category,
      price: body.price,
      description: body.description,
      image: body.image,
      rating: body.rating,
    },
  });
  return NextResponse.json(newItem);
}
