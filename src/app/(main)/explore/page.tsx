import { MapboxView } from "@/components/map/MapboxView";
import { db } from "@/db"
import { meetups as meetupsTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import Link from 'next/link';

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
    time: meetupsTable.time
  }).from(meetupsTable).where(eq(meetupsTable.visibility, 'public'))
  
  const meetups = (meetupsArr || []).filter(m => m.lat !== null && m.lng !== null) as any[]

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:flex-row overflow-hidden bg-background">
      {/* Map Section */}
      <div className="w-full h-1/2 md:h-full md:flex-1 relative z-0">
         <MapboxView meetups={meetups || []} />
      </div>
      
      {/* Sidebar (Filters & List) */}
      <div className="w-full h-1/2 md:h-full md:w-[400px] bg-card border-t md:border-t-0 md:border-l border-border flex flex-col z-10 overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b border-border/40 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-foreground">Rutas cercanas</h2>
            <p className="text-sm text-muted-foreground mt-1">Explora en el mapa o en la lista.</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto w-full">
          {(meetups || []).length > 0 ? (
             meetups?.map(m => (
               <Link href={`/meetups/${m.id}`} key={m.id}>
                 <div className="p-4 rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                   <h3 className="font-semibold text-primary group-hover:underline">{m.title}</h3>
                   <div className="mt-2 text-xs text-muted-foreground flex gap-2 items-center">
                     <span className="font-medium text-foreground">{m.date} - {m.time}</span>
                   </div>
                 </div>
               </Link>
             ))
          ) : (
            <div className="flex h-full items-center justify-center flex-col text-center space-y-2 opacity-50">
              <p className="text-sm text-muted-foreground">No se encontraron quedadas en esta área.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
