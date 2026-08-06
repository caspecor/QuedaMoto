import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test DB connection
    const result = await db.select({ count: sql<number>`count(*)` }).from(users)
    return NextResponse.json({ 
      status: 'ok', 
      userCount: result[0]?.count,
      postgres_url_set: !!process.env.POSTGRES_URL,
      postgres_url_prefix: process.env.POSTGRES_URL ? process.env.POSTGRES_URL.substring(0, 30) + '...' : 'NOT_SET'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      postgres_url_set: !!process.env.POSTGRES_URL,
    }, { status: 500 })
  }
}
