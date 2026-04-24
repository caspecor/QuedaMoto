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

          return { id: user.id, name: user.username, email: user.email }
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
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)
