import { db } from "@/db"
import { users as usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Bike, MapPin, Trophy, Shield, Info, Instagram, Youtube, 
  Share2, MessageCircle, ExternalLink, Settings, Sparkles, Mail
} from "lucide-react"
import { BackButton } from "@/components/ui/BackButton"
import { LevelProgressBar } from "@/components/profile/LevelProgressBar"
import { ShareProfileButton } from "@/components/profile/ShareProfileButton"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userArr = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1)
  const rider = userArr[0]

  return {
    title: rider ? `${rider.username} - Rider QuedaMoto` : "Perfil de Rider - QuedaMoto",
    description: rider ? `Conoce a ${rider.username} y su garaje de motos en QuedaMoto Canarias.` : "Perfil de usuario en QuedaMoto.",
  }
}

export default async function RiderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  
  const userArr = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1)
  const rider = userArr[0]

  if (!rider) {
    notFound()
  }

  const isOwner = session?.user?.id === rider.id

  const displayVehicles = rider.vehicles && rider.vehicles.length > 0 
    ? rider.vehicles 
    : (rider.moto_brand ? [{ brand: rider.moto_brand, model: rider.moto_model || '', image: '' }] : []);

  const socials = rider.socials || {};

  const getSocialLink = (platform: string, handle: string) => {
    if (!handle) return "#";
    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
    switch (platform) {
      case 'instagram': return `https://instagram.com/${cleanHandle}`;
      case 'tiktok': return `https://tiktok.com/@${cleanHandle}`;
      case 'youtube': return handle.startsWith('http') ? handle : `https://youtube.com/${handle}`;
      default: return "#";
    }
  }

  return (
    <div className="min-h-screen bg-mesh pt-24 sm:pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8 animate-reveal">
        
        {/* Navigation & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <BackButton />
          
          <div className="flex items-center gap-3">
            {isOwner ? (
              <Link href="/profile">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-10 px-4 rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Editar mi perfil</span>
                </Button>
              </Link>
            ) : null}

            <ShareProfileButton 
              userId={rider.id}
              username={rider.username}
              vehicles={displayVehicles}
              city={rider.city}
              variant="compact"
            />
          </div>
        </div>

        {/* Hero Rider Banner Card */}
        <div className="bg-card border border-white/8 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
            {/* Avatar */}
            <div className="shrink-0">
              <Avatar className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-primary/30 shadow-2xl overflow-hidden ring-4 ring-black/60">
                <AvatarImage src={rider.avatar || ""} className="object-cover" />
                <AvatarFallback className="text-4xl sm:text-5xl bg-primary/10 text-primary font-black uppercase">
                  {rider.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/15 border border-primary/30 rounded-full text-primary text-xs font-black uppercase tracking-wider">
                  <Shield className="h-3.5 w-3.5" />
                  {rider.level || 'Novato'}
                </span>
                {rider.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-wider">
                    🛡️ Admin
                  </span>
                )}
                {displayVehicles.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs font-bold">
                    🏍️ {displayVehicles.length} {displayVehicles.length === 1 ? 'moto' : 'motos'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white italic tracking-tight">
                {rider.username}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/60 text-xs sm:text-sm font-medium">
                {rider.city && (
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-xl border border-white/5">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>{rider.city}</span>
                  </div>
                )}
                {rider.style && (
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-xl border border-white/5">
                    <Trophy className="h-4 w-4 text-primary shrink-0" />
                    <span>{rider.style}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(socials.instagram || socials.tiktok || socials.youtube) && (
                <div className="flex items-center justify-center md:justify-start gap-2.5 pt-2">
                  {socials.instagram && (
                    <a 
                      href={getSocialLink('instagram', socials.instagram)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="h-10 px-3.5 rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 text-white/60 hover:text-pink-400 font-bold text-xs flex items-center gap-2 transition-all"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4 text-pink-500" />
                      <span>{socials.instagram.startsWith('@') ? socials.instagram : `@${socials.instagram}`}</span>
                    </a>
                  )}
                  {socials.tiktok && (
                    <a 
                      href={getSocialLink('tiktok', socials.tiktok)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="h-10 px-3.5 rounded-xl bg-white/5 hover:bg-cyan-400/10 border border-white/10 hover:border-cyan-400/30 text-white/60 hover:text-cyan-400 font-bold text-xs flex items-center gap-2 transition-all"
                      title="TikTok"
                    >
                      <Share2 className="h-4 w-4 text-cyan-400" />
                      <span>{socials.tiktok.startsWith('@') ? socials.tiktok : `@${socials.tiktok}`}</span>
                    </a>
                  )}
                  {socials.youtube && (
                    <a 
                      href={getSocialLink('youtube', socials.youtube)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="h-10 px-3.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 font-bold text-xs flex items-center gap-2 transition-all"
                      title="YouTube"
                    >
                      <Youtube className="h-4 w-4 text-red-500" />
                      <span>Canal YouTube</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Share action on desktop */}
            <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <ShareProfileButton 
                userId={rider.id}
                username={rider.username}
                vehicles={displayVehicles}
                city={rider.city}
              />
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (col-span-8): Garage & Bio */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Garage Card */}
            <Card className="bg-card shadow-2xl border border-white/8 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/[0.01] p-6 sm:p-8 flex flex-row items-center justify-between">
                <CardTitle className="text-xl sm:text-2xl font-black flex items-center gap-3 italic text-white tracking-tight">
                  <Bike className="w-6 h-6 text-primary" /> MI GARAJE
                </CardTitle>
                <span className="text-xs font-bold text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  {displayVehicles.length} {displayVehicles.length === 1 ? 'Vehículo' : 'Vehículos'}
                </span>
              </CardHeader>
              
              <CardContent className="p-6 sm:p-8">
                {displayVehicles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {displayVehicles.map((v: any, i: number) => (
                      <div 
                        key={i} 
                        className="group relative bg-white/[0.02] rounded-3xl border border-white/8 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >
                        {v.image ? (
                          <div className="w-full h-48 sm:h-52 relative overflow-hidden bg-black/50">
                            <img 
                              src={v.image} 
                              alt={`${v.brand} ${v.model}`} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                              #{i + 1}
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center bg-white/[0.01] border-b border-white/5 relative">
                            <Bike className="h-12 w-12 text-white/10 group-hover:text-primary/30 transition-colors" />
                            <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5">
                              #{i + 1}
                            </span>
                          </div>
                        )}

                        <div className="p-5 flex items-center justify-between gap-3">
                          <div>
                            <h4 className="text-lg sm:text-xl font-black text-white leading-tight group-hover:text-primary transition-colors">
                              {v.brand || 'Moto'}
                            </h4>
                            <p className="text-white/40 font-bold text-xs sm:text-sm mt-0.5 uppercase tracking-wider">
                              {v.model || 'Modelo'}
                            </p>
                          </div>
                          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Bike className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white/[0.01] rounded-3xl border border-dashed border-white/10 space-y-3">
                    <Bike className="h-12 w-12 text-white/20 mx-auto" />
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                      Este rider aún no ha registrado vehículos en su garaje
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bio Card */}
            <Card className="bg-card shadow-2xl border border-white/8 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/[0.01] p-6 sm:p-8">
                <CardTitle className="text-xl sm:text-2xl font-black flex items-center gap-3 italic text-white tracking-tight">
                  <Info className="w-6 h-6 text-primary" /> SOBRE MÍ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <p className="text-white/70 leading-relaxed text-base sm:text-lg font-light italic bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                  "{rider.bio || "Este rider prefiere que su conducción hable por él. No ha añadido una biografía todavía."}"
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column (col-span-4 lg:sticky): Experience & Quick Details */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            
            {/* Level & XP Progression */}
            <div className="bg-card border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Trophy className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white/60">
                  Rango y Experiencia
                </h3>
              </div>
              <LevelProgressBar xp={rider.xp || 0} />
            </div>

            {/* Rider Quick Sheet */}
            <div className="bg-card border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-white/50 border-b border-white/5 pb-3">
                Ficha del Rider
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/40">Nivel de conducción</span>
                  <span className="font-bold text-white">{rider.level || 'Principiante'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/40">Estilo favorito</span>
                  <span className="font-bold text-white">{rider.style || 'Cualquiera'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/40">Ubicación</span>
                  <span className="font-bold text-white">{rider.city || 'Canarias'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-white/40">Motos en garaje</span>
                  <span className="font-bold text-primary">{displayVehicles.length}</span>
                </div>
              </div>
            </div>

            {/* Share via WhatsApp banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#25D366]/10 to-transparent border border-[#25D366]/20 space-y-3 text-center">
              <div className="h-10 w-10 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-black text-white text-sm">¿Te gusta este garaje?</h4>
                <p className="text-xs text-white/50 mt-0.5">
                  Compártelo con tus amigos o grupo motero en WhatsApp
                </p>
              </div>
              <ShareProfileButton 
                userId={rider.id}
                username={rider.username}
                vehicles={displayVehicles}
                city={rider.city}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
