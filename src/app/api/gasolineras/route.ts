import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

export const dynamic = 'force-dynamic'

export interface GasStationData {
  id: string;
  rotulo: string;
  direccion: string;
  municipio: string;
  provincia: string;
  precio95: number;
  precioDiesel: number;
  lat: number;
  lng: number;
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(
      'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroCCAA/05',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        next: { revalidate: 14400 } // Cache for 4 hours
      }
    )

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }

    const data = await res.json()
    const rawList = data.ListaEESSPrecio || []

    const parsedList: GasStationData[] = rawList
      .map((item: any) => {
        const p95Str = (item['Precio Gasolina 95 E5'] || '').replace(',', '.')
        const pDieselStr = (item['Precio Gasoleo A'] || '').replace(',', '.')
        const latStr = (item['Latitud'] || '').replace(',', '.')
        const lngStr = (item['Longitud (WGS84)'] || '').replace(',', '.')

        const price95 = parseFloat(p95Str) || 99
        const priceDiesel = parseFloat(pDieselStr) || 99

        return {
          id: item['IDEESS'] || Math.random().toString(),
          rotulo: item['Rótulo'] || 'Gasolinera',
          direccion: item['Dirección'] || '',
          municipio: item['Municipio'] || '',
          provincia: item['Provincia'] || '',
          precio95,
          precioDiesel,
          lat: parseFloat(latStr) || 0,
          lng: parseFloat(lngStr) || 0,
        }
      })
      .filter((s: GasStationData) => s.precio95 < 5 || s.precioDiesel < 5)

    // Top 4 cheapest Gasolina 95
    const topGasolina95 = [...parsedList]
      .filter(s => s.precio95 > 0.5 && s.precio95 < 4)
      .sort((a, b) => a.precio95 - b.precio95)
      .slice(0, 4)

    // Top 4 cheapest Diesel
    const topDiesel = [...parsedList]
      .filter(s => s.precioDiesel > 0.5 && s.precioDiesel < 4)
      .sort((a, b) => a.precioDiesel - b.precioDiesel)
      .slice(0, 4)

    return NextResponse.json({
      updatedAt: data.Fecha || new Date().toISOString(),
      topGasolina95,
      topDiesel,
    })
  } catch (error: any) {
    console.error('Error fetching gas stations:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
