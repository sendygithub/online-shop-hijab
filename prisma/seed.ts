import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Cek apakah admin sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@hijabparadise.com" },
  });

  if (existingAdmin) {
    console.log("Admin sudah terdaftar:", existingAdmin.email);
    return;
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

  console.log("Akun admin berhasil dibuat:");
  console.log("  Email: admin@hijabparadise.com");
  console.log("  Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
