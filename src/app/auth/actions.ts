'use server'

import { signIn, signOut } from '@/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { AuthError } from 'next-auth'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function loginAction(data: { email: string; password: string }) {
  try {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    redirect('/dashboard')
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return { error: 'Credenciales inválidas.' }
      }
      return { error: 'Ocurrió un error inesperado al iniciar sesión.' }
    }
    throw error // Re-throw to allow Next.js redirect to work if needed
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
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    
    redirect('/dashboard')
  } catch (error) {
    console.error(error)
    return { error: 'Ocurrió un error al registrarse. Inténtalo de nuevo.' }
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/auth/login' })
}
