import type { NextAuthConfig } from "next-auth"

// Edge-compatible config — NO imports from @/db or any Node.js-only module
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        // @ts-ignore
        token.role = user.role
        // @ts-ignore
        token.suspendedUntil = user.suspendedUntil
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email as string
        // @ts-ignore
        session.user.role = token.role as string
        // @ts-ignore
        session.user.suspendedUntil = token.suspendedUntil as string
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
}
