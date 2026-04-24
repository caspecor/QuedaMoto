import { signOut } from 'next-auth/react'

export async function GET() {
  // This should be handled by NextAuth signOut
  return new Response(null, { status: 302, headers: { Location: '/' } })
}