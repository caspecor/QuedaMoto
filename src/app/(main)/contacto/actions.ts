'use server'

import { db } from '@/db'
import { contactMessages } from '@/db/schema'

export async function submitContactMessage(data: { name: string; email: string; subject: string; message: string }) {
  try {
    await db.insert(contactMessages).values({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    })
    return { success: true }
  } catch (error) {
    console.error('Error submitting contact message:', error)
    return { error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' }
  }
}
