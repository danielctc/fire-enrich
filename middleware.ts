import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("auth")?.value === "true"
  const { pathname } = request.nextUrl

  const onLoginPage = pathname.startsWith("/login")
  const onProtectedPage = pathname.startsWith("/fire-enrich") || pathname === "/"

  if (onLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/fire-enrich", request.url))
    }
    return NextResponse.next()
  }

  if (onProtectedPage) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/fire-enrich/:path*", "/login"],
} 