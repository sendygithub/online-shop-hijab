import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Coba query untuk test koneksi
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ message: "Database connected!" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Database connection failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
