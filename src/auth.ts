import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const userArr = await db.select().from(users).where(eq(users.email, credentials.email as string))
        const user = userArr[0]

        if (!user || !user.password) return null

        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password)
        if (!passwordsMatch) return null

      return { 
        id: user.id, 
        name: user.username 
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
        // No guardamos role en JWT para evitar cookies grandes
        // El role se obtiene de la BD cuando se necesita
      }
      return token
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        // El role se obtiene de la BD cuando se necesita, no se copia desde token
      }
      return session
    },
  },
  // session: { strategy: "jwt" }, // Eliminado para compatibilidad con getServerSession()
  secret: process.env.NEXTAUTH_SECRET,
})

