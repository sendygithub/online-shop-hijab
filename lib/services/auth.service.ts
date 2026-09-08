import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api/http";
import type { AuthUserResult, RegisterUserInput } from "@/types";

// Registrasi user publik (role selalu "user").
export async function registerUser(
  input: RegisterUserInput,
): Promise<AuthUserResult> {
  const email = input.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) throw new ApiError("Email sudah terdaftar", 409);

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name: input.name?.trim() ?? null,
      password: hashedPassword,
      role: "user",
    },
    select: { id: true, email: true, name: true, image: true, role: true },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image,
  };
}

// Dipakai provider credentials NextAuth (authorize).
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AuthUserResult | null> {
  if (!email || !password) return null;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user?.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image,
  };
}
