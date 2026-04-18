'use server'

import { db } from '@/db'
import { meetups, attendees } from '@/db/schema'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import crypto from 'crypto'

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
      lat: 28.12,
      lng: -15.43,
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
