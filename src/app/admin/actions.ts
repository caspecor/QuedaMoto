'use server'

import { db } from '@/db'
import { users, meetups, messages, attendees, notifications, settings } from '@/db/schema'
import { eq, desc, sql, and, gte } from 'drizzle-orm'
import { auth } from "@/auth"
import { revalidatePath } from 'next/cache'

export async function getAdminStats() {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    // Get total users
    const [totalUsersResult] = await db.select({ count: sql<number>`count(*)` }).from(users)
    const totalUsers = totalUsersResult.count

    // Get new users this week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const [newUsersResult] = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, weekAgo))
    const newUsersThisWeek = newUsersResult.count

    // Get total meetups and active ones
    const [totalMeetupsResult] = await db.select({ count: sql<number>`count(*)` }).from(meetups)
    const totalMeetups = totalMeetupsResult.count

    // Get active meetups (assuming future dates)
    const today = new Date().toISOString().split('T')[0]
    const [activeMeetupsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(meetups)
      .where(sql`${meetups.date} >= ${today}`)
    const activeMeetups = activeMeetupsResult.count

    // Get messages today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const [messagesResult] = await db.select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(gte(messages.createdAt, todayStart))
    const messagesToday = messagesResult.count

    // Get blocked users
    const [blockedUsersResult] = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isBlocked, true))
    const blockedUsers = blockedUsersResult.count

    // Recent activity (last 10 items)
    const recentUsers = await db.select({
      type: sql<string>`'user'`,
      description: sql<string>`concat('Nuevo usuario: ', ${users.username})`,
      time: sql<string>`to_char(${users.createdAt}, 'DD/MM/YYYY HH24:MI')`
    }).from(users).orderBy(desc(users.createdAt)).limit(5)

    const recentMeetups = await db.select({
      type: sql<string>`'meetup'`,
      description: sql<string>`concat('Nueva quedada: ', ${meetups.title})`,
      time: sql<string>`to_char(${meetups.createdAt}, 'DD/MM/YYYY HH24:MI')`
    }).from(meetups).orderBy(desc(meetups.createdAt)).limit(5)

    const recentActivity = [...recentUsers, ...recentMeetups]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10)

    // Alerts
    const alerts = []
    if (blockedUsers > 0) {
      alerts.push({
        title: 'Usuarios bloqueados',
        description: `${blockedUsers} usuarios requieren revisión`
      })
    }

    return {
      totalUsers,
      newUsersThisWeek,
      totalMeetups,
      activeMeetups,
      messagesToday,
      blockedUsers,
      recentActivity,
      alerts
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalUsers: 0,
      newUsersThisWeek: 0,
      totalMeetups: 0,
      activeMeetups: 0,
      messagesToday: 0,
      blockedUsers: 0,
      recentActivity: [],
      alerts: []
    }
  }
}

export async function getAllUsers(page = 1, limit = 20) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const offset = (page - 1) * limit

    const usersList = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      isBlocked: users.isBlocked,
      createdAt: users.createdAt,
      city: users.city,
      moto_brand: users.moto_brand,
      moto_model: users.moto_model,
      suspendedUntil: users.suspendedUntil
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset)

    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(users)
    const total = totalResult.count

    return {
      users: usersList,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { users: [], total: 0, pages: 0, currentPage: 1 }
  }
}

export async function toggleUserBlock(userId: string, blockReason?: string) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const [user] = await db.select({ isBlocked: users.isBlocked }).from(users).where(eq(users.id, userId)).limit(1)

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    if (user.isBlocked) {
      // Unblock user
      await db.update(users)
        .set({
          isBlocked: false,
          blockedAt: null,
          blockedBy: null,
          blockReason: null
        })
        .where(eq(users.id, userId))
    } else {
      // Block user
      await db.update(users)
        .set({
          isBlocked: true,
          blockedAt: new Date(),
          blockedBy: session.user.id,
          blockReason: blockReason || 'Bloqueado por administrador'
        })
        .where(eq(users.id, userId))
    }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error toggling user block:', error)
    return { success: false, error: 'Error al cambiar estado del usuario' }
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    // Don't allow deleting admin users
    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1)

    if (user?.role === 'admin') {
      return { success: false, error: 'No se puede eliminar a un administrador' }
    }

    await db.delete(users).where(eq(users.id, userId))

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Error al eliminar usuario' }
  }
}

export async function changeUserRole(userId: string, newRole: string) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    if (!['user', 'moderator', 'admin'].includes(newRole)) {
      return { success: false, error: 'Rol inválido' }
    }

    await db.update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId))

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error changing user role:', error)
    return { success: false, error: 'Error al cambiar rol del usuario' }
  }
}

export async function getAllMeetups(page = 1, limit = 20) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const offset = (page - 1) * limit

    const meetupsList = await db.select({
      id: meetups.id,
      title: meetups.title,
      description: meetups.description,
      date: meetups.date,
      time: meetups.time,
      max_attendees: meetups.max_attendees,
      visibility: meetups.visibility,
      address: meetups.address,
      creator: {
        id: users.id,
        username: users.username
      }
    })
    .from(meetups)
    .leftJoin(users, eq(meetups.creator_id, users.id))
    .orderBy(desc(meetups.createdAt))
    .limit(limit)
    .offset(offset)

    // Get attendee counts for each meetup
    const meetupsWithCounts = await Promise.all(
      meetupsList.map(async (meetup) => {
        const [attendeeCount] = await db.select({ count: sql<number>`count(*)` })
          .from(attendees)
          .where(eq(attendees.meetup_id, meetup.id))

        return {
          ...meetup,
          attendeesCount: attendeeCount.count
        }
      })
    )

    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(meetups)
    const total = totalResult.count

    return {
      meetups: meetupsWithCounts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching meetups:', error)
    return { meetups: [], total: 0, pages: 0, currentPage: 1 }
  }
}

export async function deleteMeetup(meetupId: string) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    await db.delete(meetups).where(eq(meetups.id, meetupId))

    revalidatePath('/admin/meetups')
    return { success: true }
  } catch (error) {
    console.error('Error deleting meetup:', error)
    return { success: false, error: 'Error al eliminar quedada' }
  }
}

export async function getRecentMessages(limit = 50) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const messagesList = await db.select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      user: {
        username: users.username
      },
      meetup: {
        title: meetups.title
      }
    })
    .from(messages)
    .leftJoin(users, eq(messages.user_id, users.id))
    .leftJoin(meetups, eq(messages.meetup_id, meetups.id))
    .orderBy(desc(messages.createdAt))
    .limit(limit)

    // For now, we'll consider all messages as non-flagged
    // In a real app, you'd have a flagged_messages table or column
    const flaggedMessages = messagesList.filter(msg =>
      msg.content?.toLowerCase().includes('badword') ||
      msg.content?.toLowerCase().includes('inappropriate')
    )

    return {
      messages: messagesList,
      flaggedMessages
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return { messages: [], flaggedMessages: [] }
  }
}

export async function deleteMessage(messageId: string) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    await db.delete(messages).where(eq(messages.id, messageId))

    revalidatePath('/admin/messages')
    return { success: true }
  } catch (error) {
    console.error('Error deleting message:', error)
    return { success: false, error: 'Error al eliminar mensaje' }
  }
}

export async function suspendUser(userId: string, hours: number) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const suspendedUntil = hours === 0 ? null : new Date(Date.now() + hours * 60 * 60 * 1000)

    await db.update(users)
      .set({ suspendedUntil })
      .where(eq(users.id, userId))

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error suspending user:', error)
    return { success: false, error: 'Error al suspender usuario' }
  }
}

export async function getSiteSettings() {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const res = await db.select().from(settings)
    const config: Record<string, string> = {}
    res.forEach(s => {
      config[s.key] = s.value || ''
    })
    return config
  } catch (error) {
    console.error('Error fetching settings:', error)
    return {}
  }
}

export async function updateSiteSettings(config: Record<string, string>) {
  try {
    const session = await auth()
    if (!session?.user?.role || session?.user?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const promises = Object.entries(config).map(([key, value]) => {
      return db.insert(settings)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value, updatedAt: new Date() }
        })
    })

    await Promise.all(promises)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error updating settings:', error)
    return { success: false, error: 'Error al actualizar configuración' }
  }
}