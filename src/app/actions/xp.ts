'use server'

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export async function awardXp(userId: string, amount: number) {
  try {
    await db.update(users)
      .set({ xp: sql`COALESCE(${users.xp}, 0) + ${amount}` })
      .where(eq(users.id, userId))
  } catch (error) {
    console.error('Error awarding XP:', error)
  }
}
