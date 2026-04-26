import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { visits } from "@/db/schema"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const { path } = await req.json()
    
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    // Geolocation from Vercel headers
    const city = req.headers.get('x-vercel-ip-city') || 'unknown'
    const country = req.headers.get('x-vercel-ip-country') || 'unknown'
    const lat = req.headers.get('x-vercel-ip-latitude') || 'unknown'
    const lng = req.headers.get('x-vercel-ip-longitude') || 'unknown'

    if (userAgent.toLowerCase().includes('bot')) {
      return NextResponse.json({ ok: true })
    }

    await db.insert(visits).values({
      userId: session?.user?.id || null,
      ip,
      path,
      userAgent,
      city,
      country,
      lat,
      lng,
      createdAt: new Date()
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error recording visit:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
