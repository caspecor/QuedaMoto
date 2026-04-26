import { db } from "@/db"
import { users as usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bike, MapPin, Trophy, Shield, Info, Instagram, Youtube, Share2 } from "lucide-react"
import { BackButton } from "@/components/ui/BackButton"

export const metadata = {
  title: "Rider Profile - QuedaMoto",
}

export default async function RiderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const userArr = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1)
  const rider = userArr[0]

  if (!rider) {
    notFound()
  }

  const displayVehicles = rider.vehicles && rider.vehicles.length > 0 
    ? rider.vehicles 
    : (rider.moto_brand ? [{ brand: rider.moto_brand, model: rider.moto_model }] : []);

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
    <div className="container px-4 pt-32 pb-24 max-w-4xl mx-auto space-y-8 animate-reveal">
      {/* Back Button */}
      <BackButton />

      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Avatar className="w-40 h-40 border-8 border-white/[0.03] shadow-2xl overflow-hidden ring-4 ring-primary/10">
            <AvatarImage src={rider.avatar || ""} className="object-cover" />
            <AvatarFallback className="text-5xl bg-primary/10 text-primary font-black uppercase">
              {rider.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-2">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{rider.level || 'Novato'}</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
               {rider.username}
             </h1>
             <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                {rider.city && (
                  <div className="flex items-center gap-2 text-white/40">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm tracking-tight">{rider.city}</span>
                  </div>
                )}
                {rider.style && (
                  <div className="flex items-center gap-2 text-white/40">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm tracking-tight">{rider.style}</span>
                  </div>
                )}
             </div>

             {/* Social Links Bar */}
             <div className="flex justify-center md:justify-start gap-3 mt-6">
                {socials.instagram && (
                  <a 
                    href={getSocialLink('instagram', socials.instagram)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/20 transition-all"
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {socials.tiktok && (
                  <a 
                    href={getSocialLink('tiktok', socials.tiktok)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/20 transition-all"
                    title="TikTok"
                  >
                    <Share2 className="w-5 h-5" />
                  </a>
                )}
                {socials.youtube && (
                  <a 
                    href={getSocialLink('youtube', socials.youtube)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                    title="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        {/* Main Content - Garage */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card shadow-2xl border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.01] p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3 italic">
                <Bike className="w-7 h-7 text-primary" /> MI GARAJE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {displayVehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayVehicles.map((v: any, i: number) => (
                    <div key={i} className="group relative bg-white/[0.02] p-6 rounded-3xl border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300">
                      <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 group-hover:text-primary group-hover:scale-110 transition-all">
                        <Bike className="h-4 w-4" />
                      </div>
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-primary/60 mb-1">Vehículo #{i+1}</p>
                      <h4 className="text-xl font-black text-white leading-tight">{v.brand}</h4>
                      <p className="text-white/40 font-bold text-sm mt-1">{v.model}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                  <p className="text-white/20 font-bold uppercase tracking-widest text-sm">Sin vehículos registrados</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card className="bg-card shadow-2xl border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.01] p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3 italic">
                <Info className="w-7 h-7 text-primary" /> SOBRE MÍ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
               <p className="text-white/60 leading-relaxed text-lg font-medium italic">
                 {rider.bio || "Este rider prefiere que su conducción hable por él. No hay biografía disponible."}
               </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quick Stats */}
        <div className="space-y-8">
           <Card className="bg-primary shadow-[0_0_50px_-12px_rgba(255,77,0,0.4)] border-none rounded-[2.5rem] overflow-hidden text-black">
              <CardContent className="p-8 space-y-6">
                 <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Status</p>
                    <p className="text-3xl font-black italic uppercase leading-none">Rider Activo</p>
                 </div>
                 <div className="h-px bg-black/10" />
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Nivel</p>
                       <p className="font-black text-lg leading-none">{rider.level || 'Novato'}</p>
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Estilo</p>
                       <p className="font-black text-lg leading-none">{rider.style || 'Cualquiera'}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
              <p className="text-[10px] uppercase font-black tracking-widest text-white/20">Acción</p>
              <a 
                href={`mailto:${rider.email}`}
                className="flex items-center justify-center w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
              >
                Enviar Mensaje
              </a>
           </div>
        </div>
      </div>
    </div>
  )
}
