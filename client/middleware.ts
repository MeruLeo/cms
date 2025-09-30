import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;

  // کاربر لاگین نیست → اجازه ورود به /protected نداره
  if (!refreshToken && pathname.startsWith("/protected")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // کاربر لاگین هست → نباید دوباره بیاد /auth
  if (refreshToken && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/auth/:path*"],
};
