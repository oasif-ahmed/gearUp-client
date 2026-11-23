
import { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];

const PUBLIC_ROUTES = [
  "/",
  "/gear-items",
  "/features",
  "/about",
];

const isRoute = (pathname: string, routes: string[]) => {
  return routes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );
};

const getDashboardRoute = (role: string | null) => {
  switch (role) {
    case "CUSTOMER":
      return "/customer-cart";

    case "PROVIDER":
      return "/dashboard/provider";

    case "ADMIN":
      return "/dashboard/admin";

    default:
      return "/";
  }
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Read access token
  const accessToken = request.cookies.get("accessToken")?.value;

  // 2. Verify access token
  const decodedToken = accessToken
    ? jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      )
    : null;

  const isAuthenticated = decodedToken?.success === true;

  // 3. Get user role
  const userRole =
    isAuthenticated && decodedToken.data
      ? (decodedToken.data as JwtPayload).role
      : null;

  // 4. Authenticated users cannot access login/register
  if (isAuthenticated && isRoute(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(
      new URL(getDashboardRoute(userRole), request.url)
    );
  }

  // 5. Allow public routes
  if (
    isRoute(pathname, PUBLIC_ROUTES) ||
    isRoute(pathname, AUTH_ROUTES)
  ) {
    return NextResponse.next();
  }

  // 6. Protect all remaining routes
  if (!isAuthenticated) {
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    if (accessToken) {
      response.cookies.delete("accessToken");
    }

    return response;
  }

  // 7. Role-based authorization
  if (
    pathname.startsWith("/customer-cart") &&
    userRole !== "CUSTOMER"
  ) {
    return NextResponse.redirect(
      new URL("/forbidden", request.url)
    );
  }

  if (
    pathname.startsWith("/dashboard/provider") &&
    userRole !== "PROVIDER"
  ) {
    return NextResponse.redirect(
      new URL("/forbidden", request.url)
    );
  }

  if (
    pathname.startsWith("/dashboard/admin") &&
    userRole !== "ADMIN"
  ) {
    return NextResponse.redirect(
      new URL("/forbidden", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
