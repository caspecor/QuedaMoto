import { getAllMeetups, getAdminStats } from "@/app/admin/actions"
import { MeetupsTable } from "@/components/admin/MeetupsTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Zap } from "lucide-react"

export const metadata = {
  title: "Gestión de Quedadas - Admin",
}

export default async function AdminMeetupsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = parseInt(page || "1")
  
  const { meetups, total, pages } = await getAllMeetups(currentPage)
  const stats = await getAdminStats()

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Gestión de Quedadas</h1>
          <p className="text-white/40 font-medium">Modera y supervisa las rutas de la comunidad</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calendar className="h-16 w-16 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white/40">Total Quedadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-white italic">{stats.totalMeetups}</p>
            <p className="text-xs text-white/20 font-bold mt-2">Histórico acumulado</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="h-16 w-16 text-yellow-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white/40">Rutas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-yellow-500 italic">{stats.activeMeetups}</p>
            <p className="text-xs text-white/20 font-bold mt-2">Próximas salidas</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white/40">Mensajes Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-blue-500 italic">{stats.messagesToday}</p>
            <p className="text-xs text-white/20 font-bold mt-2">Actividad en chats</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
          <CardTitle className="text-xl font-black flex items-center gap-3 italic">
            <Calendar className="w-6 h-6 text-primary" /> LISTADO DE RUTAS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MeetupsTable 
            meetups={meetups} 
            totalPages={pages} 
            currentPage={currentPage} 
          />
        </CardContent>
      </Card>
    </div>
  )
}