import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { gasolinerasCanarias, gasolinerasSyncLog } from '@/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const MITECO_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroCCAA/05'

/** Derives the Canary Island name from the Spanish postal code */
function cpToIsla(cp: string): string {
  const n = parseInt(cp || '0', 10)
  if (n >= 35001 && n <= 35489) return 'Gran Canaria'
  if (n >= 35490 && n <= 35579) return 'Lanzarote'
  if (n >= 35580 && n <= 35679) return 'Fuerteventura'
  if (n >= 38001 && n <= 38699) return 'Tenerife'
  if (n >= 38700 && n <= 38799) return 'La Palma'
  if (n >= 38800 && n <= 38849) return 'La Gomera'
  if (n >= 38900 && n <= 38999) return 'El Hierro'
  return 'Canarias'
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const expectedToken = process.env.SYNC_SECRET || 'quedamoto-sync'

  if (token !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Auto-migrate schema to ensure columns and tables exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS gasolineras_canarias (
        id TEXT PRIMARY KEY,
        rotulo TEXT NOT NULL,
        direccion TEXT,
        municipio TEXT,
        provincia TEXT,
        cp TEXT,
        isla TEXT,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        precio_95 DOUBLE PRECISION,
        precio_diesel DOUBLE PRECISION,
        precio_98 DOUBLE PRECISION,
        horario TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      );
      ALTER TABLE gasolineras_canarias ADD COLUMN IF NOT EXISTS cp TEXT;
      ALTER TABLE gasolineras_canarias ADD COLUMN IF NOT EXISTS isla TEXT;
      CREATE INDEX IF NOT EXISTS idx_gasolineras_isla ON gasolineras_canarias (isla);
      CREATE INDEX IF NOT EXISTS idx_gasolineras_precio_95 ON gasolineras_canarias (precio_95 ASC NULLS LAST);
      CREATE INDEX IF NOT EXISTS idx_gasolineras_precio_diesel ON gasolineras_canarias (precio_diesel ASC NULLS LAST);
      CREATE TABLE IF NOT EXISTS gasolineras_sync_log (
        id SERIAL PRIMARY KEY,
        synced_at TIMESTAMP DEFAULT NOW(),
        total_rows INTEGER,
        source_date TEXT
      );
    `)

    console.log('[GasolinerasSync] Fetching MITECO data…')
    const res = await fetch(MITECO_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error(`MITECO responded ${res.status}`)

    const data = await res.json()
    const rawList: any[] = data.ListaEESSPrecio || []
    const sourceDate: string = data.Fecha || ''

    if (rawList.length === 0) throw new Error('MITECO returned an empty list')

    const parsePrice = (str: string) => {
      const v = parseFloat((str || '').replace(',', '.'))
      return isNaN(v) || v <= 0 ? null : v
    }
    const parseLoc = (str: string) => {
      const v = parseFloat((str || '').replace(',', '.'))
      return isNaN(v) ? null : v
    }

    const rows = rawList
      .map((item) => {
        const cp = (item['C.P.'] || '').trim()
        return {
          id: item['IDEESS'] as string,
          rotulo: (item['Rótulo'] || 'Gasolinera') as string,
          direccion: (item['Dirección'] || null) as string | null,
          municipio: (item['Municipio'] || null) as string | null,
          provincia: (item['Provincia'] || null) as string | null,
          cp: cp || null,
          isla: cpToIsla(cp),
          lat: parseLoc(item['Latitud']),
          lng: parseLoc(item['Longitud (WGS84)']),
          precio95: parsePrice(item['Precio Gasolina 95 E5']),
          precioDiesel: parsePrice(item['Precio Gasoleo A']),
          precio98: parsePrice(item['Precio Gasolina 98 E5']),
          horario: (item['Horario'] || null) as string | null,
          updatedAt: new Date(),
        }
      })
      .filter((r) => r.id)

    console.log(`[GasolinerasSync] Upserting ${rows.length} stations…`)

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
            cp: sql`excluded.cp`,
            isla: sql`excluded.isla`,
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

    await db.insert(gasolinerasSyncLog).values({ totalRows: rows.length, sourceDate })
    console.log(`[GasolinerasSync] Done. Source date: ${sourceDate}`)

    return NextResponse.json({ status: 'ok', synced: rows.length, sourceDate })
  } catch (err: any) {
    console.error('[GasolinerasSync] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
