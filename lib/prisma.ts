import net from "node:net";
import dns from "node:dns";

// Fix koneksi Neon/Postgres di WSL: DNS sering resolve IPv6 duluan
// padahal IPv6 tidak tersedia -> ETIMEDOUT. Paksa preferensi IPv4.
// (harus dijalankan sebelum PrismaClient diinstansiasi)
net.setDefaultAutoSelectFamily(false);
dns.setDefaultResultOrder("ipv4first");

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
