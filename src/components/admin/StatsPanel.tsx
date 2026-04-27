'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getVisitsData } from "@/app/admin/actions"
import { Download, Globe, MapPin, MousePointer2, User } from "lucide-react"
import * as XLSX from 'xlsx'
import { format } from "date-fns"

export function StatsPanel() {
  const [visits, setVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getVisitsData()
      setVisits(data)
      setLoading(false)
    }
    load()
  }, [])

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(visits.map(v => ({
      Fecha: format(new Date(v.createdAt), 'dd/MM/yyyy HH:mm:ss'),
      IP: v.ip,
      Ciudad: v.city,
      Pais: v.country,
      Latitud: v.lat,
      Longitud: v.lng,
      Ruta: v.path,
      'User Agent': v.userAgent,
      'ID Usuario': v.userId || 'Invitado'
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Visitas")
    XLSX.writeFile(wb, `Stats_QuedaMoto_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }

  if (loading) return <div className="p-8 text-white/40 font-bold uppercase tracking-widest text-xs animate-pulse">Analizando tráfico...</div>

  // Calculate some quick stats
  const totalVisits = visits.length
  const uniqueIps = new Set(visits.map(v => v.ip)).size
  const topCities = Array.from(visits.reduce((acc: Map<string, number>, v) => {
    acc.set(v.city || 'Desconocido', (acc.get(v.city || 'Desconocido') || 0) + 1)
    return acc
  }, new Map<string, number>()).entries()).sort((a, b) => b[1] - a[1]).slice(0, 3)

  const groupedVisits: any[] = Array.from(visits.reduce((acc, v) => {
    if (!acc.has(v.ip)) {
      acc.set(v.ip, {
        ip: v.ip,
        city: v.city,
        country: v.country,
        lastVisit: v.createdAt,
        totalHits: 1,
        paths: new Set([v.path]),
        isRegistered: !!v.userId
      })
    } else {
      const existing = acc.get(v.ip)!
      existing.totalHits++
      existing.paths.add(v.path)
      // visits are ordered descending by date usually, so first seen in array is the latest
      if (new Date(v.createdAt) > new Date(existing.lastVisit)) {
        existing.lastVisit = v.createdAt
      }
      if (v.userId) existing.isRegistered = true
    }
    return acc
  }, new Map<string, any>()).values()).sort((a: any, b: any) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden group hover:bg-white/[0.07] transition-all">
          <CardContent className="p-8 space-y-3">
            <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
              <MousePointer2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Visitas (Hits)</p>
              <p className="text-3xl font-black text-white italic">{totalVisits}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden group hover:bg-white/[0.07] transition-all">
          <CardContent className="p-8 space-y-3">
            <div className="h-10 w-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">IPs Únicas</p>
              <p className="text-3xl font-black text-white italic">{uniqueIps}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden group hover:bg-white/[0.07] transition-all">
          <CardContent className="p-8 space-y-3">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Top Ciudades</p>
              <p className="text-xs font-bold text-white/60">
                {topCities.map(([city, count]) => `${city} (${count})`).join(', ') || 'Sin datos'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-white/10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">REGISTRO DE TRÁFICO (AGRUPADO)</CardTitle>
            <CardDescription className="text-white/40">Mostrando las últimas interacciones por dirección IP</CardDescription>
          </div>
          <Button 
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-black uppercase text-[10px] tracking-widest px-6 h-11 rounded-xl transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)]"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5 h-12 hover:bg-transparent">
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30 pl-8">Última Visita</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30">IP</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30">Ubicación</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30">Actividad</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedVisits.map((v, i) => (
                  <TableRow key={i} className="border-white/5 hover:bg-white/[0.02] transition-colors h-16">
                    <TableCell className="pl-8 text-xs font-bold text-white/60">
                      {format(new Date(v.lastVisit), 'dd/MM HH:mm')}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-white/40">{v.ip}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{v.city || 'Desconocido'}</span>
                        <span className="text-[10px] text-white/30 uppercase font-black">{v.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-primary font-bold">{v.totalHits} hits</span>
                        <span className="text-[9px] text-white/30 uppercase font-black">{v.paths.size} rutas únicas</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {v.isRegistered ? (
                        <div className="flex items-center gap-2 text-blue-400">
                          <User className="h-3 w-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Registrado</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Invitado</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {visits.length === 0 && (
            <div className="p-20 text-center text-white/10 font-black uppercase tracking-[0.3em] text-sm">
              Sin datos de tráfico aún
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
