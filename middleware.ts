import { auth } from "@/auth"

export default auth((req) => {
  // This middleware will run for all routes that match the pattern
})

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"]
}