import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refresh_token");
  console.log("[middleware] cookies:", request.cookies.getAll());
  console.log("[middleware] hasRefreshToken:", hasRefreshToken);

  // 로그인 상태에서 /onboarding 접근 시 홈으로
  if (pathname.startsWith("/onboarding") && hasRefreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding", "/onboarding/:path*"],
};
