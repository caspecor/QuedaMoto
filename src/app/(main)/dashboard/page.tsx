import { auth } from "@/auth"
import { db } from "@/db"
import { attendees as attendeesTable, meetups as meetupsTable, notifications as notificationsTable } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Search, Calendar, MapPin, Bell, MessageSquare, UserPlus, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export const metadata = {
  title: "Dashboard - QuedaMoto",
}

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect("/auth/login")
  }

  let upcomingMeetups: any[] = []
  let notifications: any[] = []

  try {
    // Fetch upcoming meetups user is attending
    const attendeeRecords = await db.select({
      meetup: meetupsTable
    }).from(attendeesTable)
      .innerJoin(meetupsTable, eq(attendeesTable.meetup_id, meetupsTable.id))
      .where(eq(attendeesTable.user_id, user.id!))
      .orderBy(desc(meetupsTable.date))
      .limit(5)

    upcomingMeetups = attendeeRecords.map(a => a.meetup) || []
  } catch (err) {
    console.error("Error fetching meetups:", err)
  }

  try {
    // Fetch notifications
    notifications = await db.select()
      .from(notificationsTable)
      .where(eq(notificationsTable.user_id, user.id!))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(10)
  } catch (err) {
    console.error("Error fetching notifications. Table might not exist yet:", err)
    // Fallback notification for first-time use
    notifications = []
  }

  return (
    <div className="min-h-screen bg-mesh pb-20">
      <div className="container px-4 pt-32 pb-12 max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-reveal">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-sans text-white tracking-tight">Mi Garaje</h1>
            <p className="text-white/40 mt-2 text-lg font-medium">Bienvenido de nuevo, {user.name?.split(' ')[0] || 'Rider'}.</p>
          </div>
          <Link href="/meetups/create" className={buttonVariants({ className: "h-14 px-8 rounded-2xl font-bold bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-all w-full md:w-auto" })}>
            <PlusCircle className="mr-2 h-5 w-5" /> Nueva Ruta
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Main Content: Upcoming Meetups */}
          <div className="lg:col-span-2 space-y-6 animate-reveal [animation-delay:0.1s]">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm">Próximas Salidas</h2>
            </div>
            
            <div className="grid gap-4">
              {upcomingMeetups.length > 0 ? (
                upcomingMeetups.map((meetup: any) => (
                  <Link 
                    key={meetup.id} 
                    href={`/meetups/${meetup.id}`}
                    className="group relative flex flex-col p-6 rounded-3xl glass-card transition-all hover:bg-white/[0.05]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">{meetup.type}</span>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{meetup.title}</h3>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <PlusCircle className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-white/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary/60" />
                        <span className="font-medium text-white/70">{meetup.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary/60" />
                        <span className="font-medium text-white/70 truncate max-w-[200px]">{meetup.address || 'Punto por definir'}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02] text-white/30 space-y-4">
                  <PlusCircle className="h-10 w-10 opacity-20" />
                  <p className="font-medium">No tienes rutas programadas todavía.</p>
                  <Link href="/explore" className={buttonVariants({ variant: "outline", className: "rounded-xl border-white/10" })}>
                    Explorar ahora
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Notifications */}
          <div className="space-y-6 animate-reveal [animation-delay:0.2s]">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm">Notificaciones</h2>
            </div>

            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notif: any) => (
                  <div 
                    key={notif.id} 
                    className={`relative p-4 rounded-2xl border transition-all ${notif.isRead ? 'bg-white/[0.02] border-white/5 text-white/40' : 'bg-primary/5 border-primary/20 text-white'}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'chat' ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
                        {notif.type === 'chat' ? <MessageSquare className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                      </div>
                      <div className="space-y-1 pr-4">
                        <h4 className="text-xs font-bold leading-tight">{notif.title}</h4>
                        <p className="text-xs opacity-70 leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] opacity-40 font-bold uppercase tracking-wider pt-1">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
                        </p>
                      </div>
                    </div>
                    {notif.link && (
                      <Link 
                        href={notif.link} 
                        className="absolute inset-0 z-0"
                        aria-label="Ir al evento"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center space-y-3">
                  <Info className="h-8 w-8 mx-auto text-white/10" />
                  <p className="text-sm text-white/30 font-medium">Todo al día. No hay actividad reciente.</p>
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <button className="w-full py-3 text-[10px] uppercase font-black tracking-[0.2em] text-white/20 hover:text-white/40 transition-colors">
                Marcar todas como leídas
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
