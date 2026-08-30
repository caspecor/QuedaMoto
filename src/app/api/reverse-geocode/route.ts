import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ display_name: '' })
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'QuedaMoto/1.0 (https://quedamoto.vercel.app)',
          'Accept-Language': 'es,en;q=0.9',
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ display_name: '' })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Reverse geocode server route error:', error)
    return NextResponse.json({ display_name: '' })
  }
}
