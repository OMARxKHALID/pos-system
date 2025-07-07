import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasPermission, getRequiredPermission } from "@/utils/permission-utils";

const PUBLIC_PATHS = [
  "/_next",
  "/api/auth",
  "/favicon.ico",
  "/manifest.json",
  "/robots.txt",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return checkPermissions(token, pathname, request);
}

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

function checkPermissions(token, pathname, request) {
  const { role, permissions = [] } = token;

  if (!role) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const requiredPermission = getRequiredPermission(pathname);

  if (!requiredPermission) {
    return NextResponse.next();
  }

  const hasAccess = hasPermission({ role, permissions }, requiredPermission);

  if (!hasAccess) {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    dashboardUrl.searchParams.set("error", "insufficient_permissions");
    dashboardUrl.searchParams.set("required_permission", requiredPermission);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
