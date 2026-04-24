import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const userArr = await db.select().from(users).where(eq(users.email, credentials.email as string))
          const user = userArr[0]

          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password)
          if (!passwordsMatch) return null

          return { id: user.id, name: user.username, email: user.email, role: user.role || undefined }
        } catch (err) {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    jwt: ({ token, user }: { token: any; user: any }) => {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    session: ({ session, token }: { session: any; token: any }) => {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const nextAuth = NextAuth(authOptions)
export const { handlers, signIn, signOut, auth } = nextAuth
