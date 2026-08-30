import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { gasolinerasCanarias, gasolinerasSyncLog } from '@/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'
// Allow up to 30 seconds for the sync (Vercel Pro limit)
export const maxDuration = 30

const MITECO_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroCCAA/05'

// Protect with a secret token: call GET /api/gasolineras/sync?token=<SYNC_SECRET>
// or use a Vercel cron job with Authorization header
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const expectedToken = process.env.SYNC_SECRET || 'quedamoto-sync'

  if (token !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('[GasolinerasSync] Fetching MITECO data…')
    const res = await fetch(MITECO_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`MITECO responded ${res.status}`)
    }

    const data = await res.json()
    const rawList: any[] = data.ListaEESSPrecio || []
    const sourceDate: string = data.Fecha || ''

    if (rawList.length === 0) {
      throw new Error('MITECO returned an empty station list')
    }

    // Parse stations and filter out those with no useful price data
    const rows = rawList.map((item) => {
      const parsePrice = (str: string) => {
        const v = parseFloat((str || '').replace(',', '.'))
        return isNaN(v) || v <= 0 ? null : v
      }
      const parseLoc = (str: string) => {
        const v = parseFloat((str || '').replace(',', '.'))
        return isNaN(v) ? null : v
      }

      return {
        id: item['IDEESS'] as string,
        rotulo: (item['Rótulo'] || 'Gasolinera') as string,
        direccion: (item['Dirección'] || null) as string | null,
        municipio: (item['Municipio'] || null) as string | null,
        provincia: (item['Provincia'] || null) as string | null,
        lat: parseLoc(item['Latitud']),
        lng: parseLoc(item['Longitud (WGS84)']),
        precio95: parsePrice(item['Precio Gasolina 95 E5']),
        precioDiesel: parsePrice(item['Precio Gasoleo A']),
        precio98: parsePrice(item['Precio Gasolina 98 E5']),
        horario: (item['Horario'] || null) as string | null,
        updatedAt: new Date(),
      }
    }).filter((r) => r.id) // only rows with valid IDEESS

    console.log(`[GasolinerasSync] Upserting ${rows.length} stations…`)

    // Bulk upsert – replace all Canarias rows with fresh data
    // Batch in groups of 100 to avoid hitting PostgreSQL param limits
    const BATCH = 100
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH)
      await db
        .insert(gasolinerasCanarias)
        .values(batch)
        .onConflictDoUpdate({
          target: gasolinerasCanarias.id,
          set: {
            rotulo: sql`excluded.rotulo`,
            direccion: sql`excluded.direccion`,
            municipio: sql`excluded.municipio`,
            provincia: sql`excluded.provincia`,
            lat: sql`excluded.lat`,
            lng: sql`excluded.lng`,
            precio95: sql`excluded.precio_95`,
            precioDiesel: sql`excluded.precio_diesel`,
            precio98: sql`excluded.precio_98`,
            horario: sql`excluded.horario`,
            updatedAt: sql`excluded.updated_at`,
          },
        })
    }

    // Log sync
    await db.insert(gasolinerasSyncLog).values({
      totalRows: rows.length,
      sourceDate,
    })

    console.log(`[GasolinerasSync] Done. Source date: ${sourceDate}`)

    return NextResponse.json({
      status: 'ok',
      synced: rows.length,
      sourceDate,
    })
  } catch (err: any) {
    console.error('[GasolinerasSync] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
