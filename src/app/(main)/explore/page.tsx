import { MapboxView } from "@/components/map/MapboxView";
import { db } from "@/db"
import { meetups as meetupsTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, Map as MapIcon, List, Search } from "lucide-react";
import { MeetupCard } from "@/components/meetups/MeetupCard";

export const metadata = {
  title: "Explorar Quedadas - QuedaMoto",
};

export default async function ExplorePage() {
  const meetupsArr = await db.select({
    id: meetupsTable.id,
    title: meetupsTable.title,
    lat: meetupsTable.lat,
    lng: meetupsTable.lng,
    date: meetupsTable.date,
    time: meetupsTable.time,
    type: meetupsTable.type,
    level_required: meetupsTable.level_required,
    max_attendees: meetupsTable.max_attendees
  }).from(meetupsTable).where(eq(meetupsTable.visibility, 'public'))
  
  const meetups = (meetupsArr || []).filter(m => m.lat !== null && m.lng !== null) as any[]

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:flex-row overflow-hidden bg-background pt-16">
      {/* Map Section */}
      <div className="w-full h-1/2 md:h-full md:flex-1 relative z-0 border-r border-white/5">
         <MapboxView meetups={meetups || []} />
      </div>
      
      {/* Sidebar (Filters & List) */}
      <div className="w-full h-1/2 md:h-full md:w-[450px] bg-card flex flex-col z-10 overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Rutas Cercanas</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 h-10 w-10">
                <SlidersHorizontal className="w-4 h-4 text-white/40" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-white/30 font-medium">Encuentra tu próximo desafío en el mapa o en la lista.</p>
        </div>
        
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto w-full custom-scrollbar">
          {(meetups || []).length > 0 ? (
             meetups?.map(m => (
               <MeetupCard key={m.id} meetup={m} />
             ))
          ) : (
            <div className="flex h-full items-center justify-center flex-col text-center space-y-4 opacity-30 py-20">
              <Search className="h-12 w-12 text-white" />
              <p className="text-sm text-white font-medium">No se encontraron quedadas en esta área.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
