'use server'

import { db } from '@/db'
import { meetups, attendees } from '@/db/schema'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'

export async function deleteMeetupAction(meetupId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'No estás autenticado.' }

    // Verify the user is the creator before deleting
    const meetup = await db.select().from(meetups).where(eq(meetups.id, meetupId)).limit(1).then(r => r[0])
    if (!meetup) return { error: 'Quedada no encontrada' }
    if (meetup.creator_id !== session.user.id) return { error: 'No tienes permiso para eliminar esta quedada' }

    await db.delete(meetups).where(eq(meetups.id, meetupId))

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error al eliminar la quedada' }
  }
}

export async function updateMeetupAction(meetupId: string, data: any) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'No estás autenticado.' }

    const meetup = await db.select().from(meetups).where(eq(meetups.id, meetupId)).limit(1).then(r => r[0])
    if (!meetup) return { error: 'Quedada no encontrada' }
    if (meetup.creator_id !== session.user.id) return { error: 'Sin permiso' }

    await db.update(meetups).set({
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      max_attendees: parseInt(data.max_attendees),
      address: data.address,
      address_notes: data.address_notes || null,
      type: data.type,
      level_required: data.level_required,
      visibility: data.visibility,
    }).where(eq(meetups.id, meetupId))

    revalidatePath(`/meetups/${meetupId}`)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error al actualizar la quedada' }
  }
}

export async function createMeetupAction(data: any) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: 'No estás autenticado.' }
    }

    const meetupId = crypto.randomUUID()
    
    // Default config values
    const payload = {
      ...data,
      id: meetupId,
      creator_id: session.user.id,
      lat: data.lat || 28.12,
      lng: data.lng || -15.43,
      address_notes: data.address_notes || null,
      createdAt: new Date()
    }

    await db.insert(meetups).values(payload)

    await db.insert(attendees).values({
      meetup_id: meetupId,
      user_id: session.user.id,
      status: 'attending',
      joinedAt: new Date()
    })

    return { success: true, meetupId }
  } catch (error: any) {
    console.error(error)
    return { error: 'Ocurrió un error al crear la ruta.' }
  }
}

export async function sendChatMessage(meetupId: string, content: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: 'No estás autenticado.' }
    }

    const { messages } = await import('@/db/schema')
    
    await db.insert(messages).values({
      meetup_id: meetupId,
      user_id: session.user.id,
      content,
    })

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error al enviar mensaje' }
  }
}

export async function getChatMessages(meetupId: string) {
  try {
    const { messages, users } = await import('@/db/schema')
    const { eq, desc } = await import('drizzle-orm')

    const result = await db.select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      user: {
        id: users.id,
        username: users.username,
        avatar: users.avatar
      }
    }).from(messages)
      .innerJoin(users, eq(messages.user_id, users.id))
      .where(eq(messages.meetup_id, meetupId))
      .orderBy(desc(messages.createdAt))
      .limit(50)

    return { messages: result.reverse() }
  } catch (error) {
    console.error(error)
    return { error: 'Error al cargar mensajes' }
  }
}

export async function joinMeetupAction(meetupId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Inicia sesión primero' }

    await db.insert(attendees).values({
      meetup_id: meetupId,
      user_id: session.user.id,
      status: 'attending',
    })

    revalidatePath(`/meetups/${meetupId}`)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error al unirse a la quedada' }
  }
}

export async function leaveMeetupAction(meetupId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Inicia sesión primero' }

    await db.delete(attendees).where(
      and(
        eq(attendees.meetup_id, meetupId),
        eq(attendees.user_id, session.user.id)
      )
    )

    revalidatePath(`/meetups/${meetupId}`)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error al abandonar la quedada' }
  }
}
