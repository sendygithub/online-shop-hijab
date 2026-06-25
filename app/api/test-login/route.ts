import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Cari user admin
    const user = await prisma.user.findUnique({
      where: { email: "admin@hijabparadise.com" },
    });

    if (!user) {
      return NextResponse.json({
        error: "User tidak ditemukan",
        exists: false,
      });
    }

    // Test password
    const isPasswordValid = await bcrypt.compare("admin123", user.password!);

    return NextResponse.json({
      exists: true,
      email: user.email,
      name: user.name,
      role: user.role,
      hasPassword: !!user.password,
      passwordValid: isPasswordValid,
      passwordHashLength: user.password?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
