import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdminRoot = pathname === "/admin" || pathname === "/admin/";
  const isAdmin = pathname.startsWith("/admin");
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (isAdmin && !isLogin && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if ((isLogin || isAdminRoot) && isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLoggedIn) {
    if (pathname.startsWith("/admin/pengguna") && role !== "SUPER_ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }

    if (
      (pathname.startsWith("/admin/kategori") ||
        pathname.startsWith("/admin/galeri")) &&
      role !== "SUPER_ADMIN" &&
      role !== "EDITOR"
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
