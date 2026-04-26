import { db } from "@/db"
import { visits } from "@/db/schema"
import { headers } from "next/headers"

export async function recordVisit(userId?: string) {
  try {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const userAgent = headerList.get('user-agent') || 'unknown'
    const path = headerList.get('referer') || '/' // or use a more accurate way

    // Basic geolocation from headers (Vercel provides these)
    const city = headerList.get('x-vercel-ip-city') || 'unknown'
    const country = headerList.get('x-vercel-ip-country') || 'unknown'
    const lat = headerList.get('x-vercel-ip-latitude') || 'unknown'
    const lng = headerList.get('x-vercel-ip-longitude') || 'unknown'

    // Only record if it's not a bot and not an admin (optional)
    if (userAgent.includes('bot')) return

    await db.insert(visits).values({
      userId,
      ip,
      userAgent,
      path,
      city,
      country,
      lat,
      lng,
      createdAt: new Date()
    })
  } catch (error) {
    console.error('Error recording visit:', error)
  }
}
