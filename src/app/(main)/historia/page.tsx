import Image from "next/image"
import { Flag, Users, HeartHandshake } from "lucide-react"

export const metadata = {
  title: "Nuestra Historia - QuedaMoto",
  description: "Descubre por qué creamos QuedaMoto",
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-mesh pb-20">
      <div className="container px-4 pt-32 pb-12 max-w-5xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-reveal">
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">
            EL ORIGEN DE <br/>
            <span className="text-primary">QUEDAMOTO</span>
          </h1>
          <p className="text-xl text-white/50 font-medium max-w-3xl mx-auto">
            Nacimos de una frustración común: querer salir a rodar y no tener con quién.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center animate-reveal [animation-delay:0.2s]">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">No Más Rutas En Solitario</h2>
            <div className="h-1 w-20 bg-primary" />
            <div className="space-y-4 text-white/60 font-medium leading-relaxed">
              <p>
                Todo empezó un domingo por la mañana. La moto limpia, el depósito lleno, el clima perfecto... y nadie con quien compartir la curva. Los grupos de WhatsApp estaban inactivos y en Facebook era imposible organizar algo organizado.
              </p>
              <p>
                Nos dimos cuenta de que la comunidad motera es gigante, pero estaba desconectada. ¿Cuántos riders de nuestra misma ciudad estarían en ese momento buscando a alguien de su mismo nivel para hacer una ruta?
              </p>
              <p>
                Ahí nació <strong>QuedaMoto</strong>. Una plataforma diseñada específicamente para las necesidades de los moteros. Sin ruido, sin complicaciones. Solo un mapa, un punto de encuentro y gas.
              </p>
            </div>
          </div>
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border border-white/5">
            <Image 
              src="/images/rider-bg.png" 
              alt="Moteros en ruta" 
              fill 
              className="object-cover"
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 pt-12 animate-reveal [animation-delay:0.4s]">
          {[
            {
              icon: Users,
              title: "Comunidad Primero",
              desc: "No somos una empresa buscando beneficios. Somos moteros haciendo herramientas para moteros."
            },
            {
              icon: HeartHandshake,
              title: "Inclusividad",
              desc: "No importa si llevas una scooter de 125cc o una R1 de 1000cc. Si tienes pasión por las dos ruedas, eres de los nuestros."
            },
            {
              icon: Flag,
              title: "Respeto Absoluto",
              desc: "Promovemos el compañerismo y la seguridad en ruta. Nunca dejamos a un compañero atrás."
            }
          ].map((value, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl text-center space-y-4 border-t border-white/10 hover:-translate-y-2 transition-transform">
              <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                <value.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">{value.title}</h3>
              <p className="text-white/40 text-sm font-medium">{value.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
