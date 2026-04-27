'use server'

import { db } from '@/db'
import { users, meetups, attendees, messages as messagesTable, notifications } from '@/db/schema'
import { redirect } from 'next/navigation'
import { auth } from "@/auth"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { eq, and, desc, gte, sql } from 'drizzle-orm'
import { XP_REWARDS } from '@/lib/gamification'


async function checkSuspension(userId: string) {
  const [user] = await db.select({ suspendedUntil: users.suspendedUntil }).from(users).where(eq(users.id, userId)).limit(1)
  if (user?.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
    return user.suspendedUntil
  }
  return null
}

export async function getNotifications() {
  try {
    const session = await auth()
    if (!session?.user?.id) return { notifications: [] }

    const res = await db.select()
      .from(notifications)
      .where(eq(notifications.user_id, session.user.id!))
      .orderBy(desc(notifications.createdAt))
      .limit(10)

    return { notifications: res }
  } catch (error) {
    console.error(error)
    return { notifications: [] }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false }

    await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.user_id, session.user.id!)))

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

export async function deleteNotification(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false }

    await db.delete(notifications).where(and(
      eq(notifications.id, id),
      eq(notifications.user_id, session.user.id!)
    ))

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

export async function deleteMeetupAction(meetupId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'No estás autenticado.' }

    // Verify the user is the creator before deleting
    const meetup = await db.select().from(meetups).where(eq(meetups.id, meetupId)).limit(1).then(r => r[0])
    if (!meetup) return { error: 'Quedada no encontrada' }
    if (meetup.creator_id !== session.user.id) return { error: 'No tienes permiso para eliminar esta quedada' }

    // Check if the date has passed
    const today = new Date().toISOString().split('T')[0]
    if (meetup.date < today) {
      return { error: 'No se puede eliminar una quedada cuya fecha ya ha pasado.' }
    }

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
    const isSuspended = await checkSuspension(session.user.id)
    if (isSuspended) return { error: `Tu cuenta está suspendida hasta el ${isSuspended.toLocaleString()}` }

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
    const isSuspended = await checkSuspension(session.user.id)
    if (isSuspended) return { error: `Tu cuenta está suspendida hasta el ${isSuspended.toLocaleString()}` }

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

    // Award XP for creating a meetup
    try {
      await db.update(users).set({ xp: sql`COALESCE(${users.xp}, 0) + ${XP_REWARDS.CREATE_MEETUP}` }).where(eq(users.id, session.user.id))
    } catch (e) { console.error('XP award error:', e) }

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
    const isSuspended = await checkSuspension(session.user.id)
    if (isSuspended) return { error: `Cuenta suspendida temporalmente.` }

    // 1. Insert message (Core operation)
    await db.insert(messagesTable).values({
      meetup_id: meetupId,
      user_id: session.user.id,
      content,
    })

    // 2. Notification logic (Isolated task)
    // We wrap this in a separate try-catch so message sending doesn't fail if notifications do
    try {
      const currentUser = session.user
      // Fetch meetup title and creator
      const meetup = await db.select().from(meetups).where(eq(meetups.id, meetupId)).limit(1).then(r => r[0])
      
      // Fetch all attendees to notify them
      const attendeesList = await db.select().from(attendees).where(eq(attendees.meetup_id, meetupId))
      
      const notificationPromises = attendeesList
        .filter(a => a.user_id !== currentUser!.id)
        .map(a => {
          console.log(`[NOTIFY] Creating notification for user ${a.user_id} in meetup ${meetupId}`)
          return db.insert(notifications).values({
            user_id: a.user_id,
            type: 'chat',
            title: `Nuevo mensaje en ${meetup?.title || 'Ruta'}`,
            message: `${currentUser!.name || 'Alguien'} ha escrito en el chat.`,
            link: `/meetups/${meetupId}#chat`,
            isRead: false
          })
        })
      
      await Promise.allSettled(notificationPromises)
    } catch (notifyError) {
      console.error("[Chat Notification Error]", notifyError)
      // We don't return error here, as the message was already sent
    }

    // Award XP for sending a message
    try {
      await db.update(users).set({ xp: sql`COALESCE(${users.xp}, 0) + ${XP_REWARDS.SEND_MESSAGE}` }).where(eq(users.id, session.user.id))
    } catch (e) { console.error('XP award error:', e) }

    revalidatePath('/dashboard')
    revalidatePath(`/meetups/${meetupId}`)
    return { success: true }
  } catch (error) {
    console.error("[Chat Send Error]", error)
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
    const isSuspended = await checkSuspension(session.user.id)
    if (isSuspended) return { error: `Tu cuenta está suspendida hasta el ${isSuspended.toLocaleString()}` }

    await db.insert(attendees).values({
      meetup_id: meetupId,
      user_id: session.user.id,
      status: 'attending',
    })

    revalidatePath(`/meetups/${meetupId}`)

    // Award XP for joining a meetup
    try {
      await db.update(users).set({ xp: sql`COALESCE(${users.xp}, 0) + ${XP_REWARDS.JOIN_MEETUP}` }).where(eq(users.id, session.user.id))
    } catch (e) { console.error('XP award error:', e) }

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

export async function getActiveMeetupsCount() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const res = await db.select()
      .from(meetups)
      .where(
        and(
          eq(meetups.visibility, 'public'),
          gte(meetups.date, today)
        )
      )
    return res.length
  } catch (error) {
    return 0
  }
}

export async function getPublicMeetups() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const res = await db.select({
      id: meetups.id,
      title: meetups.title,
      lat: meetups.lat,
      lng: meetups.lng,
    }).from(meetups)
      .where(
        and(
          eq(meetups.visibility, 'public'),
          gte(meetups.date, today)
        )
      )
    
    return { meetups: res.filter(m => m.lat !== null && m.lng !== null) }
  } catch (error) {
    console.error(error)
    return { meetups: [] }
  }
}

export async function getUserAvatar() {
  try {
    const session = await auth()
    if (!session?.user?.id) return null
    
    const userArr = await db.select({ avatar: users.avatar }).from(users).where(eq(users.id, session.user.id)).limit(1)
    return userArr[0]?.avatar || null
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function updateProfile(data: {
  name?: string;
  avatar?: string;
  moto_brand?: string;
  moto_model?: string;
  city?: string;
  level?: string;
  style?: string;
  bio?: string;
  vehicles?: { brand: string; model: string }[];
  socials?: { instagram?: string; tiktok?: string; youtube?: string };
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "No autenticado" }
    const isSuspended = await checkSuspension(session.user.id)
    if (isSuspended) return { error: "No puedes editar tu perfil mientras estás suspendido." }

    const updateData: any = {}
    if (data.name) updateData.username = data.name
    if (data.avatar) updateData.avatar = data.avatar
    if (data.moto_brand !== undefined) updateData.moto_brand = data.moto_brand
    if (data.moto_model !== undefined) updateData.moto_model = data.moto_model
    if (data.city !== undefined) updateData.city = data.city
    if (data.level !== undefined) updateData.level = data.level
    if (data.style !== undefined) updateData.style = data.style
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.vehicles !== undefined) updateData.vehicles = data.vehicles
    if (data.socials !== undefined) updateData.socials = data.socials

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))

    revalidatePath('/profile')
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Error al actualizar perfil" }
  }
}

export async function updatePassword(oldPass: string, newPass: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "No autenticado" }

    const userArr = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)
    const user = userArr[0]

    if (!user || !user.password) return { error: "Usuario no encontrado" }

    const isMatch = await bcrypt.compare(oldPass, user.password)
    if (!isMatch) return { error: "La contraseña actual es incorrecta" }

    const hashed = await bcrypt.hash(newPass, 10)
    await db.update(users)
      .set({ password: hashed })
      .where(eq(users.id, session.user.id))

    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Error al actualizar contraseña" }
  }
}



export async function createTestNotification(userId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not auth" }

    await db.insert(notifications).values({
      user_id: userId,
      type: 'chat',
      title: 'Notificación de Prueba',
      message: 'Esto es una prueba del sistema de notificaciones.',
      link: '/dashboard#chat',
      isRead: false
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    console.error("Test Notify Error", err)
    return { success: false, error: String(err) }
  }
}
