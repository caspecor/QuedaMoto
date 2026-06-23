import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export const { auth: middleware, handlers, auth, signIn, signOut } = NextAuth(authConfig)

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/auth/:path*'],
}
