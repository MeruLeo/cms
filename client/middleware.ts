import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  const publicPaths = ["/auth", "/auth/login", "/auth/register"];

  if (!refreshToken && !publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (refreshToken && publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
