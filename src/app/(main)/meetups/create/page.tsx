import { CreateMeetupForm } from "@/components/meetups/CreateMeetupForm"
import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"

export const metadata = {
  title: "Organizar Ruta - QuedaMoto",
  description: "Crea y organiza tu próxima ruta en moto, desayuno o quedada con la comunidad motera de Canarias.",
}

export default function CreateMeetupPage() {
  return (
    <div className="min-h-screen bg-mesh pt-24 sm:pt-28 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header bar */}
        <div className="mb-6 sm:mb-8 animate-reveal">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs sm:text-sm mb-4 transition-colors py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Explorar
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 border border-primary/30 rounded-full mb-3 shadow-[0_0_15px_rgba(255,77,0,0.15)]">
                <Compass className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Nueva Aventura · QuedaMoto
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tight text-white uppercase">
                Organizar <span className="text-primary">Quedada</span>
              </h1>
              <p className="text-white/50 mt-1.5 text-sm sm:text-base max-w-2xl font-medium">
                Define el punto de encuentro en el mapa, fecha, ritmo y si será abierta para toda la comunidad o exclusiva con invitación de WhatsApp.
              </p>
            </div>
          </div>
        </div>

        <CreateMeetupForm />
      </div>
    </div>
  )
}
