import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Proteksi halaman admin: wajib login & role admin.
// (Halaman /admin/login tetap boleh diakses publik.)
// Next 16: konvensi file ini "proxy" (pengganti "middleware").
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL(
      `/admin/login?callbackUrl=${encodeURIComponent(pathname)}`,
      request.url,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
