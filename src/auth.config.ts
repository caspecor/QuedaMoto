import type { NextAuthConfig } from "next-auth"

// This config is Edge-compatible (no Node.js-only imports like pg)
// It only handles session/JWT callbacks, NOT the credentials authorize (which needs DB)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminPath = nextUrl.pathname.startsWith('/admin')

      if (isAdminPath) {
        if (!isLoggedIn) return false
        // @ts-ignore
        if (auth?.user?.role !== 'admin') return false
        return true
      }

      return true
    },
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
