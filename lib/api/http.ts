import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// Error bisnis dengan status HTTP. Dilempar service, diterjemahkan route.
export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface SessionUser {
  id: string;
  email: string;
  role: string;
}

// Baca sesi JWT (strategi session: jwt). Dipakai route handler & server action.
// Tidak memakai getServerSession() (rawan di Next 16 + next-auth v4).
export async function getSessionUser(
  request: NextRequest,
): Promise<SessionUser | null> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token?.id) return null;
  return {
    id: String(token.id),
    email: typeof token.email === "string" ? token.email : "",
    role: typeof token.role === "string" ? token.role : "user",
  };
}

// Guard role admin untuk endpoint backend. Lempar ApiError bila gagal.
export async function requireAdmin(
  request: NextRequest,
): Promise<SessionUser> {
  const user = await getSessionUser(request);
  if (!user) throw new ApiError("Anda harus login terlebih dahulu", 401);
  if (user.role !== "admin") {
    throw new ApiError("Akses ditolak: butuh role admin", 403);
  }
  return user;
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Data tidak valid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("[api] error tak terduga:", error);
  return NextResponse.json(
    { error: "Terjadi kesalahan pada server" },
    { status: 500 },
  );
}
