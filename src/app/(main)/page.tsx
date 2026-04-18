import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Users, Shield, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center">
        <Image 
          src="https://images.unsplash.com/photo-1558980394-0a06c4631733?q=80&w=2070" 
          alt="Bikers riding" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="relative z-10 container px-4 md:px-6 text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-lg font-sans">
            Encuentra moteros <br className="hidden sm:block" />
            <span className="text-primary">cerca de ti</span>
          </h1>
          <p className="mx-auto max-w-[600px] text-xl text-gray-300 md:text-2xl drop-shadow">
            Sube a la moto y únete a quedadas espontáneas o planificadas en toda España.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/explore" 
              className={buttonVariants({ size: "lg", className: "text-lg px-8 py-6 rounded-full font-bold shadow-primary/25 shadow-2xl" })}
            >
              Ver Quedadas
            </Link>
            <Link 
              href="/meetups/create" 
              className={buttonVariants({ size: "lg", variant: "outline", className: "text-lg px-8 py-6 rounded-full border-2 bg-background/50 backdrop-blur" })}
            >
              Organizar Ruta
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-20 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Rutas Locales</h3>
              <p className="text-muted-foreground">Descubre los mejores rincones y curvas cerca de tu ciudad.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Comunidad Activa</h3>
              <p className="text-muted-foreground">Conoce a moteros con tus mismos gustos y niveles de experiencia.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Eventos Diarios</h3>
              <p className="text-muted-foreground">Desde un café rápido hasta viajes de fin de semana completos.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Seguridad</h3>
              <p className="text-muted-foreground">Perfiles verificados y valoraciones para rodar con tranquilidad.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Placeholder */}
      <footer className="w-full border-t border-border/40 py-8 bg-card mt-auto">
        <div className="container px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} QuedaMoto. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
