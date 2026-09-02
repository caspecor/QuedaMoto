import { auth } from "@/auth"
import { db } from "@/db"
import { users as usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { LevelProgressBar } from "@/components/profile/LevelProgressBar"
import { ProfileEditForm } from "@/components/profile/ProfileEditForm"
import { BikeCard } from "@/components/profile/BikeCard"
import { ExternalLink, Calendar, MapPin, Trophy, Sparkles } from "lucide-react"

export const metadata = {
  title: "Mi Perfil - QuedaMoto",
  description: "Administra tus datos de motero, tu garaje y las estadísticas de tus rutas.",
}

export default async function ProfilePage() {
  const session = await auth()
  const userSession = session?.user

  if (!userSession) {
    redirect("/auth/login")
  }

  const userArr = await db.select().from(usersTable).where(eq(usersTable.id, userSession.id!)).limit(1)
  const profile = userArr[0]

  return (
    <div className="min-h-screen bg-mesh pt-24 sm:pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8 animate-reveal">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 border border-primary/30 rounded-full mb-2.5 shadow-[0_0_15px_rgba(255,77,0,0.15)]">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Panel de Usuario
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-sans text-white tracking-tight">
              Mi Perfil de <span className="text-primary italic">Rider</span>
            </h1>
            <p className="text-white/40 mt-1.5 text-sm sm:text-base font-medium">
              Gestiona tu identidad en la comunidad, tu garaje de motos y tus credenciales de acceso.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/riders/${profile?.id}`}>
              <Button 
                variant="outline" 
                className="h-11 px-4 rounded-xl font-bold bg-white/5 border-white/10 hover:bg-white/10 text-white flex items-center gap-2 cursor-pointer text-xs"
              >
                <ExternalLink className="h-4 w-4 text-primary" />
                <span>Ver perfil público</span>
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="h-11 px-4 rounded-xl font-bold bg-white/5 border-white/10 hover:bg-white/10 text-white cursor-pointer text-xs"
              >
                <Calendar className="h-4 w-4 mr-1 text-primary" /> Mis Quedadas
              </Button>
            </Link>

            <LogoutButton />
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column / Sidebar (col-span-4 lg:sticky) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Rider Identity Card */}
            <div className="bg-card border border-white/8 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent pointer-events-none" />
              
              <div className="relative pt-4">
                <Avatar className="w-28 h-28 sm:w-32 sm:h-32 mx-auto border-4 border-primary/30 shadow-2xl overflow-hidden ring-4 ring-black/50">
                  <AvatarImage src={profile?.avatar || ""} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary font-black uppercase">
                    {profile?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-1.5 relative z-10">
                <h2 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight">
                  {profile?.username}
                </h2>
                <p className="text-white/40 text-xs sm:text-sm font-medium truncate max-w-[280px] mx-auto">
                  {profile?.email}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                  {profile?.city && (
                    <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {profile.city}
                    </span>
                  )}
                  <span className="text-xs font-bold text-white/50 px-3 py-1 bg-white/5 border border-white/10 rounded-full uppercase text-[10px] tracking-wider">
                    {profile?.role === 'admin' ? '🛡️ Admin' : '🏍️ Rider'}
                  </span>
                </div>
              </div>

              {profile?.bio && (
                <p className="text-xs text-white/60 italic bg-white/[0.02] p-3.5 rounded-2xl border border-white/5 line-clamp-3 leading-relaxed">
                  "{profile.bio}"
                </p>
              )}

              <div className="pt-2 border-t border-white/5">
                <Link
                  href={`/riders/${profile?.id}`}
                  className="text-xs text-primary hover:text-primary/80 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Ver cómo ven otros usuarios tu ficha</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Level & XP Progression Card */}
            <div className="bg-card border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Trophy className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white/60">
                  Rango y Experiencia
                </h3>
              </div>
              <LevelProgressBar xp={profile?.xp || 0} />
            </div>
          </div>

          {/* Right Column / Content Area (col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Bikes / Garage Section */}
            <BikeCard profile={profile} />

            {/* Account Settings and Security Section */}
            <ProfileEditForm profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}
