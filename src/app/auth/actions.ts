'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { authLimiter } from '@/lib/rate-limit'
import { headers } from 'next/headers'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  phone: z.string().min(9),
})

export async function signupAction(rawData: any) {
  try {
    // Apply rate limiting
    const headerList = await headers()
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"
    try {
      await authLimiter.check(null, 10, `signup_${ip}`)
    } catch (e) {
      return { error: 'Demasiados intentos. Por favor, espera 15 minutos.' }
    }

    // Validate input
    const validated = signupSchema.safeParse(rawData)
    if (!validated.success) {
      return { error: 'Datos de registro inválidos.' }
    }
    const data = validated.data

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
