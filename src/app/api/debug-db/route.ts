import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const connStr = process.env.SUPABASE_DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
  let host = 'UNKNOWN'
  try {
    if (connStr) {
      const url = new URL(connStr.replace('postgresql://', 'http://').replace('postgres://', 'http://'))
      host = url.hostname
    }
  } catch (e) {
    host = 'PARSE_ERROR'
  }

  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users)
    const userList = await db.select({ email: users.email, role: users.role, username: users.username }).from(users).limit(10)

    return NextResponse.json({ 
      status: 'ok', 
      connected_host: host,
      is_supabase: host.includes('supabase'),
      totalUsers: result[0]?.count,
      users: userList,
    })
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error_caught', 
      connected_host: host,
      is_supabase: host.includes('supabase'),
      postgres_url_present: !!process.env.POSTGRES_URL,
      postgres_url_preview: process.env.POSTGRES_URL ? process.env.POSTGRES_URL.substring(0, 25) + '...' : 'NONE',
      message: error.message || String(error),
      stack: error.stack
    }, { status: 200 })
  }
}
