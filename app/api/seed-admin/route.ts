import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Coba cek koneksi database dulu
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      // Database belum siap, coba push schema
      return NextResponse.json(
        {
          error:
            "Database belum siap. Jalankan 'npx prisma db push' di terminal Vercel atau hubungi developer.",
          hint: "Gunakan Vercel CLI: vercel env pull && npx prisma db push",
        },
        { status: 500 },
      );
    }

    // Cek apakah admin sudah ada
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@hijabparadise.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin sudah terdaftar",
        email: existingAdmin.email,
        role: existingAdmin.role,
      });
    }

    // Buat akun admin
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.create({
      data: {
        email: "admin@hijabparadise.com",
        name: "Admin Hijab Paradise",
        password: hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json({
      message: "Akun admin berhasil dibuat",
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Seed admin error:", error);
    return NextResponse.json(
      {
        error: "Gagal membuat akun admin",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
