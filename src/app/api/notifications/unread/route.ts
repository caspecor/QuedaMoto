import { auth } from "@/auth"
import { db } from "@/db"
import { notifications as notificationsTable } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    console.log("[API Notif] Unauthorized access attempt")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const unread = await db.select()
      .from(notificationsTable)
      .where(and(
        eq(notificationsTable.user_id, session.user.id),
        eq(notificationsTable.isRead, false)
      ))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(5)

    console.log(`[API Notif] Found ${unread.length} unread notifications for user ${session.user.id}`)
    return NextResponse.json({ unread })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
