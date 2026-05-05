import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { authLimiter, generalLimiter } from "@/lib/rate-limit"

export default auth(async (req) => {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"
  const pathname = req.nextUrl.pathname

  try {
    // Apply general rate limiting for analytics/visits
    if (pathname.startsWith("/api/visits")) {
      await generalLimiter.check(null, 15, `visits_${ip}`)
    }
  } catch (error) {
    // Always return JSON for API/Auth/Action routes so the client can show a toast
    return NextResponse.json(
      { error: "Demasiados intentos. Por favor, espera unos minutos.", code: "RATE_LIMIT" },
      { status: 429 }
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/api/:path*", "/auth/:path*"]
}