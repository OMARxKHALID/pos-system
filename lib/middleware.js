// Middleware configuration and setup

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/admin/login");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin/(protected)");

    // Redirect to login if accessing protected pages without auth
    if (isAdminPage && !isAuth) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Redirect to dashboard if accessing login page while authenticated
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(
        new URL("/admin/(protected)/dashboard", req.url)
      );
    }

    // Check admin role for admin-only pages
    if (isAdminPage && token?.role !== "admin") {
      return NextResponse.redirect(
        new URL("/admin/(protected)/dashboard", req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/(protected)/:path*", "/admin/login"],
};
