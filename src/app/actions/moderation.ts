'use server'

import { db } from "@/db"
import { reports } from "@/db/schema"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createReportAction(data: {
  reportedId: string,
  meetupId?: string,
  reason: string,
  description?: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Debes iniciar sesión')

    await db.insert(reports).values({
      reporterId: session.user.id,
      reportedId: data.reportedId,
      meetupId: data.meetupId,
      reason: data.reason,
      description: data.description,
      status: 'pending'
    })

    return { success: true }
  } catch (error) {
    console.error('Error creating report:', error)
    return { success: false, error: 'Error al enviar reporte' }
  }
}
