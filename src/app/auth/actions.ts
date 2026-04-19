'use server'

import { signIn, signOut } from '@/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { AuthError } from 'next-auth'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

export async function loginAction(data: { email: string; password: string }) {
  try {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      return { error: 'Credenciales inválidas.' }
    }
    
    return { success: true }
  } catch (error: any) {
    console.error("LOGIN ERROR:", error)
    return { error: `Error de servidor: ${error.message || 'Desconocido'}` }
  }
}

export async function signupAction(data: { email: string; password: string; username: string }) {
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
    })

    // Auto login
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
       return { error: 'Usuario registrado, pero hubo un problema al entrar. Por favor, inicia sesión.' }
    }

    return { success: true }
  } catch (error: any) {
    console.error(error)
    return { error: 'Ocurrió un error al registrarse. Inténtalo de nuevo.' }
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' })
}
