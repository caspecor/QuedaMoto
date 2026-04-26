'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getReports, updateReportStatus, blockUser, suspendUser } from "@/app/admin/actions"
import { toast } from "sonner"
import { Flag, ShieldAlert, CheckCircle, XCircle, UserX, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function ReportsTable() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    setLoading(true)
    const data = await getReports()
    setReports(data)
    setLoading(false)
  }

  const handleAction = async (reportId: string, action: 'resolved' | 'dismissed') => {
    const res = await updateReportStatus(reportId, action)
    if (res.success) {
      toast.success(action === 'resolved' ? "Reporte marcado como resuelto" : "Reporte descartado")
      loadReports()
    } else {
      toast.error(res.error)
    }
  }

  const handleBlock = async (userId: string, reportId: string) => {
    const res = await blockUser(userId)
    if (res.success) {
      toast.success("Usuario bloqueado permanentemente")
      handleAction(reportId, 'resolved')
    } else {
      toast.error(res.error)
    }
  }

  if (loading) return <div className="p-12 text-center text-white/20 font-black uppercase tracking-widest text-xs animate-pulse">Cargando incidencias...</div>

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-card border-white/10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <CardTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <ShieldAlert className="text-red-500 h-6 w-6" /> REPORTES DE USUARIOS
            </CardTitle>
            <CardDescription className="text-white/40">Gestión de denuncias y moderación de contenido</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5 h-12 hover:bg-transparent">
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30 pl-8">Estado / Fecha</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30">Denunciante</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30">Denunciado</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30">Motivo / Descripción</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-white/30">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                    <TableCell className="pl-8 py-6">
                      <div className="flex flex-col gap-2">
                        <Badge variant="outline" className={`w-fit uppercase text-[8px] font-black rounded-full px-2 ${
                          report.status === 'pending' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5' :
                          report.status === 'resolved' ? 'border-green-500/50 text-green-500 bg-green-500/5' :
                          'border-white/10 text-white/20'
                        }`}>
                          {report.status === 'pending' ? 'Pendiente' : report.status === 'resolved' ? 'Resuelto' : 'Descartado'}
                        </Badge>
                        <span className="text-[10px] font-bold text-white/20">
                          {format(new Date(report.createdAt), 'dd MMM, HH:mm', { locale: es })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">@{report.reporter.username}</span>
                        <span className="text-[10px] text-white/30">{report.reporter.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-red-400">@{report.reported.username}</span>
                        <span className="text-[10px] text-white/30">{report.reported.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest block">
                          {report.reason.replace(/_/g, ' ')}
                        </span>
                        <p className="text-sm text-white/60 line-clamp-2 italic">"{report.description || 'Sin descripción'}"</p>
                        {report.meetup && (
                          <div className="flex items-center gap-1.5 text-[10px] text-white/20 font-bold uppercase mt-2">
                            <MapPin className="h-3 w-3" /> {report.meetup.title}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAction(report.id, 'dismissed')}
                            className="h-8 rounded-lg border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1.5 text-white/40" /> Descartar
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleBlock(report.reported.id, report.id)}
                            className="h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase shadow-lg shadow-red-500/20"
                          >
                            <UserX className="h-3.5 w-3.5 mr-1.5" /> Bloquear
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleAction(report.id, 'resolved')}
                            className="h-8 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase shadow-lg shadow-green-600/20"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Resolver
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/10">Finalizado</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {reports.length === 0 && (
            <div className="p-20 text-center text-white/10 font-black uppercase tracking-[0.3em] text-sm italic">
              Todo tranquilo por aquí... ¡No hay reportes! 🏍️✨
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
