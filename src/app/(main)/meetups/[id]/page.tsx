import { db } from "@/db"
import { meetups as meetupsTable, attendees, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { MapboxView } from "@/components/map/MapboxView"
import { ChatModule } from "@/components/meetups/ChatModule"
import { JoinButton } from "@/components/meetups/JoinButton"
import { OrganizerControls } from "@/components/meetups/OrganizerControls"
import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Shield, MessagesSquare, ChevronLeft, Zap, Info } from "lucide-react"
import Link from "next/link"

import { auth } from "@/auth"

export default async function MeetupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const meetupObj = await db.select().from(meetupsTable).where(eq(meetupsTable.id, id)).limit(1).then(res => res[0]);
  
  if (!meetupObj) {
    notFound()
  }

  const creatorObj = await db.select().from(users).where(eq(users.id, meetupObj.creator_id)).limit(1).then(res => res[0]);
  
  const attendeesList = await db.select({
    user_id: attendees.user_id,
    users: {
      username: users.username,
      avatar: users.avatar
    }
  }).from(attendees).innerJoin(users, eq(attendees.user_id, users.id)).where(eq(attendees.meetup_id, id));

  const meetup = {
    ...meetupObj,
    creator: creatorObj,
    attendees: attendeesList
  }

  const session = await auth()
  const user = session?.user
  const isAttending = user ? meetup.attendees.some((a: any) => a.user_id === user.id) : false
  const isCreator = user?.id === meetup.creator_id

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pt-16">
      {/* Map Section - Mobile Header / Desktop Left */}
      <div className="w-full h-80 md:h-full md:flex-1 relative order-1 md:order-2 z-0 border-l border-white/5 bg-[#030303]">
        <MapboxView meetups={[{
          id: meetup.id,
          lat: meetup.lat,
          lng: meetup.lng,
          title: meetup.title
        }]} />
        
        {/* Back Button (Floating) */}
        <Link 
          href="/explore" 
          className="absolute top-6 left-6 z-10 h-10 w-10 glass rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>

      {/* Details Section */}
      <div className="w-full md:w-[500px] lg:w-[600px] flex flex-col bg-card order-2 md:order-1 overflow-y-auto custom-scrollbar shadow-2xl relative z-10 border-r border-white/5">
        <div className="p-8 md:p-12 space-y-12 pb-32">
          
          {/* Header Info */}
          <div className="space-y-6 animate-reveal">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
                  {meetup.type}
                </div>
                {isCreator && (
                  <div className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                    Tu Ruta
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-sans leading-tight">
                {meetup.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/5 shadow-sm">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/20 text-primary font-black text-xl">
                  {meetup.creator?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Organizador</p>
                <p className="text-lg font-bold text-white leading-none">{meetup.creator?.username || 'Rider Legend'}</p>
              </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-4 animate-reveal [animation-delay:0.1s]">
            {[
              { icon: Calendar, label: "Fecha", val: meetup.date },
              { icon: Clock, label: "Hora", val: meetup.time },
              { icon: Users, label: "Plazas", val: `${meetup.attendees?.length || 0} / ${meetup.max_attendees}` },
              { icon: Shield, label: "Nivel", val: meetup.level_required }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 p-5 glass-card rounded-3xl group">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-white/20 tracking-widest">{stat.label}</p>
                  <p className="font-bold text-white text-sm">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Location Content */}
          <div className="space-y-4 animate-reveal [animation-delay:0.2s]">
            <div className="flex items-center gap-2">
               <MapPin className="h-4 w-4 text-primary" />
               <h3 className="font-black text-xs uppercase tracking-widest text-white/40">Punto de Encuentro</h3>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap className="h-16 w-16 text-primary" />
               </div>
               <p className="text-white font-bold text-lg relative z-10">{meetup.address}</p>
               {meetup.address_notes && (
                 <div className="mt-4 flex gap-3 text-sm text-white/40 italic font-medium bg-white/[0.03] p-4 rounded-2xl border-l-2 border-primary">
                    "{meetup.address_notes}"
                 </div>
               )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 animate-reveal [animation-delay:0.3s]">
            <div className="flex items-center gap-2">
               <Info className="h-4 w-4 text-primary" />
               <h3 className="font-black text-xs uppercase tracking-widest text-white/40">Detalles de la Ruta</h3>
            </div>
            <p className="text-white/60 text-lg leading-relaxed font-light bg-black/20 p-8 rounded-[40px] border border-white/5 whitespace-pre-wrap">
              {meetup.description}
            </p>
          </div>

        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-0 md:left-0 md:w-[500px] lg:w-[600px] p-6 z-50 animate-reveal [animation-delay:0.5s]">
          <div className="glass shadow-2xl rounded-[40px] p-4 flex flex-col gap-4 border border-white/10 ring-1 ring-white/5">
             {!user ? (
              <Link href="/auth/login" className={buttonVariants({ className: "w-full text-lg h-14 rounded-[28px] font-black bg-primary shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]" })}>
                ÚNETE A LA RUTA
              </Link>
            ) : isCreator ? (
               <OrganizerControls meetup={meetup as any} />
            ) : (
               <JoinButton meetupId={id} isAttending={isAttending} />
            )}
            
            {user && isAttending && (
               <div className="pt-2">
                 <ChatModule meetupId={id} userId={user.id!} />
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
