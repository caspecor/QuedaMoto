import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // This middleware will run for all routes that match the pattern
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to admin routes only for admin users
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }

        // Allow access to all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}