import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Perfil - QuedaMoto",
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  return (
    <div className="container px-4 py-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-sans text-foreground">Mi Perfil</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full"><Settings className="w-4 h-4" /></Button>
          <form action="/auth/logout" method="POST">
             <Button variant="destructive" size="icon" className="rounded-full" type="submit"><LogOut className="w-4 h-4" /></Button>
          </form>
        </div>
      </div>

      <Card className="bg-card shadow-lg border-border/50">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
           <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-xl">
             <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">{profile?.username?.[0] || 'U'}</AvatarFallback>
           </Avatar>
           <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground">{profile?.username}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              {profile?.city && <p className="text-sm font-medium mt-2">📍 {profile.city}</p>}
           </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card shadow-lg border-border/50">
        <CardHeader>
           <CardTitle className="text-xl">Mi Garaje & Estilo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           {profile?.moto_brand ? (
             <div className="grid grid-cols-2 gap-6">
               <div className="bg-background p-4 rounded-xl border border-border/50">
                  <p className="text-xs uppercase tracking-wider font-bold text-primary">Moto</p>
                  <p className="font-semibold text-lg mt-1">{profile.moto_brand} {profile.moto_model}</p>
               </div>
               <div className="bg-background p-4 rounded-xl border border-border/50">
                  <p className="text-xs uppercase tracking-wider font-bold text-primary">Nivel</p>
                  <p className="font-semibold text-lg mt-1">{profile.level}</p>
               </div>
               <div className="col-span-2 bg-background p-4 rounded-xl border border-border/50">
                  <p className="text-xs uppercase tracking-wider font-bold text-primary">Estilo favorito</p>
                  <p className="font-semibold text-lg mt-1">{profile.style}</p>
               </div>
               <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wider font-bold text-primary mb-2">Bio</p>
                  <p className="bg-background border border-border/50 p-4 rounded-xl text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
               </div>
             </div>
           ) : (
             <div className="text-center py-10 bg-background rounded-2xl border border-border/50 text-muted-foreground space-y-4">
               <p className="text-lg">Aún no has completado la información de tu moto.</p>
               <Button variant="outline" className="rounded-full border-2">Completar Perfil</Button>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  )
}
