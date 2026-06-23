import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { authLimiter } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const headerList = await headers()
        const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"
        try {
          await authLimiter.check(null, 10, `auth_${ip}`)
        } catch (e) {
          throw new Error("RATE_LIMIT")
        }

        const userArr = await db.select().from(users).where(eq(users.email, credentials.email as string))
        const user = userArr[0]

        if (!user || !user.password) return null

        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password)
        if (!passwordsMatch) return null

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
          suspendedUntil: user.suspendedUntil
        }
      },
    }),
  ],
})
