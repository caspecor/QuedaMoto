import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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
      status: 'error', 
      message: error.message,
    }, { status: 500 })
  }
}
