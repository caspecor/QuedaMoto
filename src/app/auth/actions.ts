'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAction(data: { email: string; password: string }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://dummy.supabase.co') {
    return { error: 'Añade tus credenciales reales de Supabase en .env.local para iniciar sesión.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signupAction(data: { email: string; password: string; username: string }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://dummy.supabase.co') {
    return { error: 'Añade tus credenciales reales de Supabase en .env.local para poder crear una cuenta.' }
  }

  const supabase = await createClient()

  let authData, error;
  try {
    const res = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    authData = res.data;
    error = res.error;
  } catch (err: any) {
    return { error: 'Error de conexión: No se pudo contactar a la base de datos de Supabase. (Es posible que estés usando url/keys falsos).' }
  }

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
    // Insert into public.users
    const { error: dbError } = await supabase.from('users').insert({
      id: authData.user.id,
      email: data.email,
      username: data.username,
    })
    
    if (dbError) {
      // In a real app we might clean up Auth if DB fails, but for now we ignore or return err
      console.error(dbError)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
