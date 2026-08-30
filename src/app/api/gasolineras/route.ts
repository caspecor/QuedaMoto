import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { gasolinerasCanarias, gasolinerasSyncLog } from '@/db/schema'
import { desc, asc, isNotNull, gt, lt } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    // Get top 4 cheapest Gasolina 95
    const topGasolina95 = await db
      .select()
      .from(gasolinerasCanarias)
      .where(isNotNull(gasolinerasCanarias.precio95))
      .orderBy(asc(gasolinerasCanarias.precio95))
      .limit(4)

    // Get top 4 cheapest Diesel
    const topDiesel = await db
      .select()
      .from(gasolinerasCanarias)
      .where(isNotNull(gasolinerasCanarias.precioDiesel))
      .orderBy(asc(gasolinerasCanarias.precioDiesel))
      .limit(4)

    // Get last sync date
    const lastSync = await db
      .select()
      .from(gasolinerasSyncLog)
      .orderBy(desc(gasolinerasSyncLog.syncedAt))
      .limit(1)

    const updatedAt = lastSync[0]?.sourceDate || lastSync[0]?.syncedAt?.toISOString() || null

    if (topGasolina95.length === 0 && topDiesel.length === 0) {
      return NextResponse.json({
        status: 'empty',
        message: 'No data yet. Trigger /api/gasolineras/sync first.',
        topGasolina95: [],
        topDiesel: [],
        updatedAt: null,
      })
    }

    return NextResponse.json({
      status: 'ok',
      updatedAt,
      topGasolina95: topGasolina95.map((s) => ({
        id: s.id,
        rotulo: s.rotulo,
        direccion: s.direccion || '',
        municipio: s.municipio || '',
        provincia: s.provincia || '',
        precio95: s.precio95 ?? 0,
        precioDiesel: s.precioDiesel ?? 0,
        lat: s.lat ?? 0,
        lng: s.lng ?? 0,
      })),
      topDiesel: topDiesel.map((s) => ({
        id: s.id,
        rotulo: s.rotulo,
        direccion: s.direccion || '',
        municipio: s.municipio || '',
        provincia: s.provincia || '',
        precio95: s.precio95 ?? 0,
        precioDiesel: s.precioDiesel ?? 0,
        lat: s.lat ?? 0,
        lng: s.lng ?? 0,
      })),
    })
  } catch (err: any) {
    console.error('[GasolinerasAPI] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
