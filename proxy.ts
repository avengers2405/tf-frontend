import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ACCESS_COOKIE_NAME = "access_token"
const ROLE_COOKIE_NAME = "user_role"

const roleDashboardMap: Record<string, string> = {
  student: "/dashboard/student",
  teacher: "/dashboard/teacher",
  tnp: "/dashboard/tnp",
  recruiter: "/dashboard/recruiter",
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value
  const role = request.cookies.get(ROLE_COOKIE_NAME)?.value
  const roleDashboardPath = role ? roleDashboardMap[role] : undefined

  const isAuthEntryPage = pathname === "/auth/login" || pathname === "/auth/register"

  if (isAuthEntryPage && accessToken) {
    const redirectUrl = new URL(roleDashboardPath ?? "/dashboard/student", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (!accessToken && !isAuthEntryPage) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (accessToken && pathname.startsWith("/dashboard/") && roleDashboardPath && !pathname.startsWith(roleDashboardPath)) {
    const redirectUrl = new URL(roleDashboardPath, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/applications/:path*",
    "/bulk-upload/:path*",
    "/notifications/:path*",
    "/opportunities/:path*",
    "/post-opportunity/:path*",
    "/project-progress/:path*",
    "/recommendations/:path*",
    "/resumes/:path*",
    "/team-builder/:path*",
    "/auth/login",
    "/auth/register",
  ],
}
