import { getAdminStats } from "@/app/admin/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, MessageSquare, ShieldAlert, Zap, TrendingUp, BarChart3, Clock } from "lucide-react"
import Link from "next/link"
import { SystemStatusBadge } from "@/components/admin/SystemStatusBadge"

export const metadata = {
  title: "Panel de Administración - QuedaMoto",
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-10 animate-reveal">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">ADMIN DASHBOARD</h1>
          <p className="text-white/40 font-medium text-lg mt-2">Visión global y control de la plataforma</p>
        </div>
        <div className="flex gap-4">
          <SystemStatusBadge />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Usuarios", val: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: `+${stats.newUsersThisWeek} esta semana` },
          { label: "Rutas Activas", val: stats.activeMeetups, icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10", trend: `${stats.totalMeetups} en total` },
          { label: "Interacciones", val: stats.messagesToday, icon: MessageSquare, color: "text-primary", bg: "bg-primary/10", trend: "Mensajes hoy" },
          { label: "Bloqueados", val: stats.blockedUsers, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", trend: "Requieren atención" }
        ].map((item, i) => (
          <Card key={i} className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden group hover:bg-white/[0.04] transition-all duration-500">
            <CardContent className="p-8 space-y-4">
              <div className={`h-12 w-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{item.label}</p>
                <p className="text-4xl font-black text-white italic mt-1">{item.val}</p>
              </div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-card border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-xl font-black flex items-center gap-3 italic">
              <TrendingUp className="w-6 h-6 text-primary" /> ACTIVIDAD RECIENTE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {stats.recentActivity.map((activity, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'user' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                      {activity.type === 'user' ? <Users className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="h-3 w-3 text-white/20" />
                        <p className="text-[10px] font-bold text-white/20 uppercase">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full border-white/5 text-[9px] uppercase font-black px-3 py-1">
                    {activity.type}
                  </Badge>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <div className="p-12 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                  Sin actividad reciente registrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links & Alerts */}
        <div className="space-y-8">
          <Card className="bg-primary shadow-[0_0_50px_-12px_rgba(255,77,0,0.4)] border-none rounded-[2.5rem] overflow-hidden text-black">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Control Central</p>
                <p className="text-3xl font-black italic uppercase leading-none">Accesos Rápidos</p>
              </div>
              <div className="h-px bg-black/10" />
              <div className="space-y-3">
                <Link href="/admin/users" className="flex items-center justify-between p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all font-bold">
                  <span>Usuarios</span>
                  <Users className="h-5 w-5" />
                </Link>
                <Link href="/admin/meetups" className="flex items-center justify-between p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all font-bold">
                  <span>Quedadas</span>
                  <Calendar className="h-5 w-5" />
                </Link>
                <Link href="/admin/messages" className="flex items-center justify-between p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all font-bold">
                  <span>Mensajes</span>
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {stats.alerts.length > 0 && (
            <Card className="bg-red-500/10 border border-red-500/20 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> Alertas del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                {stats.alerts.map((alert, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                    <p className="text-sm font-bold text-white">{alert.title}</p>
                    <p className="text-xs text-white/40 mt-1">{alert.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}