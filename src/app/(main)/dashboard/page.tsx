import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Search, Calendar, MapPin } from "lucide-react"

export const metadata = {
  title: "Dashboard - QuedaMoto",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch upcoming meetups user is attending (Array of objects including inner meetups object)
  const { data: attendees } = await supabase
    .from('attendees')
    .select('meetup_id, meetups(*)')
    .eq('user_id', user.id)

  const upcomingMeetups = attendees?.map(a => a.meetups).filter(Boolean) || []

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-sans text-foreground">Mi Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bienvenido de nuevo, preparándonos para la próxima ruta.</p>
        </div>
        <Link href="/meetups/create" className={buttonVariants({ className: "hidden md:flex rounded-full" })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Ruta
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-xl">Próximas rutas (Tú confirmadas)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeetups.length > 0 ? (
              upcomingMeetups.map((meetup: any) => (
                <div key={meetup.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-background">
                  <div>
                    <h3 className="font-semibold text-primary">{meetup.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {meetup.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {meetup.address || 'Ubicación oculta'}</span>
                    </div>
                  </div>
                  <Link href={`/meetups/${meetup.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                    Ver
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground space-y-3">
                <p>No tienes rutas programadas todavía.</p>
                <Link href="/explore" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  <Search className="mr-2 h-4 w-4" /> Explorar Rutas
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-xl">Notificaciones Rápidas</CardTitle>
            <CardDescription>Actividad reciente en tus eventos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm p-4 border border-border bg-background rounded-lg text-muted-foreground">
              No tienes notificaciones por el momento.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
