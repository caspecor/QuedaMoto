import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  if (!q || q.trim().length < 2) {
    return NextResponse.json([])
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'QuedaMoto/1.0 (https://quedamoto.vercel.app)',
          'Accept-Language': 'es,en;q=0.9',
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json([])
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Geocode server route error:', error)
    return NextResponse.json([])
  }
}
