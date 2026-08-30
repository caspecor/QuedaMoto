import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { gasolinerasCanarias, gasolinerasSyncLog } from '@/db/schema'
import { asc, desc, isNotNull, and, gte, lte, eq, or, ilike } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // Query params for filtering
  const isla = searchParams.get('isla') || ''
  const fuelType = searchParams.get('fuel') || '95'  // '95' | 'diesel' | '98'
  const maxPrice = parseFloat(searchParams.get('max') || '9999')
  const minPrice = parseFloat(searchParams.get('min') || '0')
  const q = (searchParams.get('q') || searchParams.get('search') || '').trim()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '30', 10))
  const offset = (page - 1) * limit
  const mode = searchParams.get('mode') || 'list'  // 'top4' | 'list'

  try {
    const priceCol = fuelType === 'diesel'
      ? gasolinerasCanarias.precioDiesel
      : fuelType === '98'
        ? gasolinerasCanarias.precio98
        : gasolinerasCanarias.precio95

    // Build where conditions
    const conditions: any[] = [isNotNull(priceCol), gte(priceCol, minPrice)]
    if (maxPrice < 9999) conditions.push(lte(priceCol, maxPrice))
    if (isla) conditions.push(eq(gasolinerasCanarias.isla, isla))
    if (q) {
      conditions.push(
        or(
          ilike(gasolinerasCanarias.rotulo, `%${q}%`),
          ilike(gasolinerasCanarias.municipio, `%${q}%`),
          ilike(gasolinerasCanarias.direccion, `%${q}%`),
          ilike(gasolinerasCanarias.cp, `%${q}%`),
          ilike(gasolinerasCanarias.isla, `%${q}%`)
        )
      )
    }

    const where = and(...conditions)

    // Top 4 cheapest for a given fuel+filter (used by widget too)
    if (mode === 'top4') {
      const top4 = await db
        .select()
        .from(gasolinerasCanarias)
        .where(where)
        .orderBy(asc(priceCol))
        .limit(4)

      return NextResponse.json({ status: 'ok', stations: top4 })
    }

    // Full list with pagination
    const [stations, lastSync] = await Promise.all([
      db
        .select()
        .from(gasolinerasCanarias)
        .where(where)
        .orderBy(asc(priceCol))
        .limit(limit + 1)      // fetch 1 extra to know if there's a next page
        .offset(offset),
      db
        .select()
        .from(gasolinerasSyncLog)
        .orderBy(desc(gasolinerasSyncLog.syncedAt))
        .limit(1),
    ])

    const hasMore = stations.length > limit
    const result = stations.slice(0, limit)
    const updatedAt = lastSync[0]?.sourceDate || null

    return NextResponse.json({
      status: 'ok',
      updatedAt,
      page,
      hasMore,
      total: result.length,
      stations: result,
    })
  } catch (err: any) {
    console.error('[GasolinerasAll] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
