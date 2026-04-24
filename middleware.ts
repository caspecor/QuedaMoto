import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Allow access to admin routes only for admin users
  if (pathname.startsWith('/admin')) {
    if (req.auth?.user?.role !== 'admin') {
      // Redirect to home if not admin
      const url = req.url.replace(pathname, '/')
      return Response.redirect(url)
    }
  }
})

export const config = {
  matcher: ["/admin/:path*"]
}