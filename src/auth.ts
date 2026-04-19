import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          const userArr = await db.select().from(users).where(eq(users.email, credentials.email as string))
          const user = userArr[0]

          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password)
          if (!passwordsMatch) return null

          return { id: user.id, name: user.username, email: user.email, image: user.avatar }
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
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.picture = user.image
      }
      
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name
        if (session.image) token.picture = session.image
      }
      
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.image = token.picture as string
      }
      return session
    },
  },
  session: { strategy: "jwt" },
  trustHost: true
})
