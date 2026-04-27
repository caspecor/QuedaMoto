'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function signupAction(data: { email: string; password: string; username: string; phone: string }) {
  try {
    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, data.email))
    if (existing.length > 0) {
      return { error: 'El email ya está registrado.' }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    // Insert into DB
    const id = crypto.randomUUID()
    await db.insert(users).values({
      id,
      email: data.email,
      username: data.username,
      password: hashedPassword,
      phone: data.phone,
    })

    return { success: true }
  } catch (error: any) {
    console.error(error)
    return { error: 'Ocurrió un error al registrarse. Inténtalo de nuevo.' }
  }
}
