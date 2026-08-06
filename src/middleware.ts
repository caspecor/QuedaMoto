import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// This middleware instance uses ONLY Edge-compatible config (no pg, no DB)
const { auth } = NextAuth(authConfig)

export const middleware = auth

export const config = {
  matcher: ['/admin/:path*'],
}
