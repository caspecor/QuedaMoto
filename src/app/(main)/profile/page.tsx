import { auth } from "@/auth"
import { db } from "@/db"
import { users as usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Perfil - QuedaMoto",
}

import { ProfileEditForm } from "@/components/profile/ProfileEditForm"
import { AvatarImage } from "@/components/ui/avatar"

export default async function ProfilePage() {
  const session = await auth()
  const userSession = session?.user

  if (!userSession) {
    redirect("/auth/login")
  }

  const userArr = await db.select().from(usersTable).where(eq(usersTable.id, userSession.id!)).limit(1)
  const profile = userArr[0]

  return (
    <div className="container px-4 pt-32 pb-8 max-w-3xl mx-auto space-y-8 animate-reveal">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black font-sans text-white tracking-tight">Mi Perfil</h1>
        <div className="flex gap-3">
          <form action="/auth/logout" method="POST">
             <Button variant="ghost" size="icon" className="rounded-full text-white/20 hover:text-red-400 hover:bg-red-400/10" type="submit">
               <LogOut className="w-5 h-5" />
             </Button>
          </form>
        </div>
      </div>

      <Card className="bg-card shadow-lg border-border/50 rounded-3xl overflow-hidden">
        <CardContent className="p-6 md:p-8 space-y-8">
           <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-8">
              <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-xl overflow-hidden">
                <AvatarImage src={profile?.avatar || ""} className="object-cover" />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary font-black uppercase">{profile?.username?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center md:text-left flex-1">
                 <h2 className="text-3xl font-black text-white italic tracking-tight">{profile?.username}</h2>
                 <p className="text-white/40 font-medium">{profile?.email}</p>
                 {profile?.city && <p className="text-sm font-bold text-primary inline-flex items-center mt-2 px-3 py-1 bg-primary/5 rounded-full">📍 {profile.city}</p>}
              </div>
           </div>

           <ProfileEditForm profile={profile} />
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
