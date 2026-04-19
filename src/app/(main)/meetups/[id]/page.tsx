import { db } from "@/db"
import { meetups as meetupsTable, attendees, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { MapboxView } from "@/components/map/MapboxView"
import { ChatModule } from "@/components/meetups/ChatModule"
import { JoinButton } from "@/components/meetups/JoinButton"
import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Shield, MessagesSquare } from "lucide-react"

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

  // Fix null latitude for MapboxView
  const validMeetup = { ...meetup, lat: meetup.lat || 0, lng: meetup.lng || 0 }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Map Section */}
      <div className="w-full h-64 md:h-full md:flex-1 relative order-2 md:order-1 z-0">
        <MapboxView meetups={[validMeetup as any]} />
      </div>

      {/* Details Section */}
      <div className="w-full md:w-[450px] lg:w-[500px] flex flex-col bg-card border-t md:border-t-0 md:border-l border-border order-1 md:order-2 overflow-y-auto shadow-2xl z-10">
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold font-sans tracking-tight text-primary">{meetup.title}</h1>
            </div>
            <div className="mt-2 inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {meetup.type}
            </div>
            
            <div className="flex items-center gap-3 mt-6 text-muted-foreground bg-background/50 p-4 rounded-2xl border border-border/50">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {meetup.creator?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="text-xs uppercase tracking-wide opacity-80">Organizador</p>
                <p className="font-bold text-foreground text-base">{meetup.creator?.username || 'Usuario'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-background rounded-2xl shadow-sm border border-border/40">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Fecha</p>
                <p className="font-semibold text-sm">{meetup.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-2xl shadow-sm border border-border/40">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Hora</p>
                <p className="font-semibold text-sm">{meetup.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-2xl shadow-sm border border-border/40">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Asistentes</p>
                <p className="font-semibold text-sm">{meetup.attendees?.length || 0} / {meetup.max_attendees}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-2xl shadow-sm border border-border/40">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Nivel</p>
                <p className="font-semibold text-sm">{meetup.level_required}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-background p-5 rounded-3xl border border-border/40 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 text-primary font-sans">
              <MapPin className="h-5 w-5" /> Punto de encuentro
            </h3>
            <div className="pl-7 space-y-2">
              <p className="text-foreground font-semibold text-sm">{meetup.address}</p>
              {meetup.address_notes && (
                <div className="mt-2 p-3 bg-muted/30 rounded-xl border-l-4 border-primary/50 text-sm italic text-muted-foreground">
                  "{meetup.address_notes}"
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-lg text-foreground">Descripción de la ruta</h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap bg-background p-4 rounded-2xl border border-border/40">{meetup.description}</p>
          </div>

          <div className="pt-6">
            {!user ? (
              <a href="/auth/login" className={buttonVariants({ className: "w-full text-lg h-14 rounded-full font-bold shadow-xl" })}>
                Inicia sesión para unirte
              </a>
            ) : isCreator ? (
               <Button className="w-full h-12 rounded-full font-bold" variant="outline" disabled>Eres el organizador</Button>
            ) : (
               <JoinButton meetupId={id} isAttending={isAttending} />
            )}
          </div>
          
          {user && isAttending && (
             <ChatModule meetupId={id} userId={user.id} />
          )}
        </div>
      </div>
    </div>
  )
}
