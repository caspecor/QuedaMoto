import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // This middleware will run for all routes that match the pattern
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true // Allow all routes for now
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"]
}