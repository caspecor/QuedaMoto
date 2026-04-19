'use client'

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { MapPin, Users, Shield, Calendar, ChevronRight, Zap, TrendingUp, Trophy } from "lucide-react"

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-mesh overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[95vh] flex items-center justify-center pt-16">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/_next/image?url=file%3A%2F%2FC%3A%2FUsers%2FAncor%2F.gemini%2Fantigravity%2Fbrain%2F2294b512-ccce-4f73-8b26-2dc0939ad82a%2Fquedamoto_premium_hero_1776600221880.png&w=3840&q=80" 
            alt="Biker Overlook" 
            fill 
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div 
          className="relative z-10 container px-4 flex flex-col items-center text-center max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md"
          >
            <Zap className="h-3 w-3 text-primary fill-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Unidos por el asfalto</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white font-sans leading-[0.9]"
          >
            LA LIBERTAD <br />
            <span className="text-primary italic">TE ESTÁ ESPERANDO</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mt-8 text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed font-medium"
          >
            Descubre las rutas más épicas y únete a la mayor comunidad de moteros apasionados. Sin filtros. Sin excusas. Solo tú y la carretera.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12 w-full max-w-md sm:max-w-none"
          >
            <Link 
              href="/explore" 
              className={buttonVariants({ size: "lg", className: "h-16 px-10 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(255,77,0,0.5)] transition-all hover:scale-[1.02]" })}
            >
              Explorar Rutas
            </Link>
            <Link 
              href="/meetups/create" 
              className={buttonVariants({ variant: "outline", size: "lg", className: "h-16 px-10 rounded-2xl font-black text-lg glass text-white hover:bg-white/10 border-white/10 transition-all" })}
            >
              Organizar Quedada
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* Trust & Activity Signals */}
      <section className="relative z-10 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Rutas Activas", val: "1.2k+", icon: TrendingUp },
              { label: "Moteros", val: "5k+", icon: Users },
              { label: "Provincias", val: "52", icon: MapPin },
              { label: "Top Riders", val: "300+", icon: Trophy }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-3xl flex flex-col items-center text-center gap-2"
              >
                <stat.icon className="h-5 w-5 text-primary/50 mb-1" />
                <span className="text-3xl font-black text-white">{stat.val}</span>
                <span className="text-[10px] uppercase font-system tracking-[0.2em] text-white/30">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-32 px-4">
        <div className="container mx-auto space-y-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="h-1 w-20 bg-primary" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                No vuelvas a rodar <br /> EN SOLITARIO.
              </h2>
              <p className="text-xl text-white/40 leading-relaxed font-light">
                Conecta con personas que comparten tu misma pasión y estilo de conducción. Desde rutas por la costa hasta trial técnico, hay un grupo esperándote.
              </p>
              <ul className="space-y-6">
                {[
                  { title: "Niveles reales", desc: "Filtra rutas según tu experiencia: Novato, Intermedio o Pro." },
                  { title: "Chat Integrado", desc: "Coordina las paradas y el repostaje antes de salir." },
                  { title: "Sin Comisiones", desc: "Plataforma 100% abierta y gratuita para la comunidad." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 group">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{item.title}</h4>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative aspect-square">
               <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full" />
               <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                 <Image 
                   src="https://images.unsplash.com/photo-1591637333184-1d0c41038676?q=80&w=1974" 
                   alt="Biker Detail" 
                   fill 
                   className="object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-transparent" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <Image 
             src="/_next/image?url=file%3A%2F%2FC%3A%2FUsers%2FAncor%2F.gemini%2Fantigravity%2Fbrain%2F2294b512-ccce-4f73-8b26-2dc0939ad82a%2Fquedamoto_community_footer_1776601046137.png&w=3840&q=80" 
             alt="Community footer" 
             fill 
             className="object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-background via-background/20 to-background" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center space-y-8">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
           >
             <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white italic">ÚNETE AL MOVIMIENTO</h2>
             <p className="mt-4 text-white/40 text-lg max-w-xl mx-auto font-medium">La carretera no tiene fin, y tu comunidad tampoco. Regístrate hoy y empieza a rodar.</p>
             <div className="mt-12">
               <Link 
                 href="/auth/register" 
                 className={buttonVariants({ size: "lg", className: "h-16 px-12 rounded-full font-black text-xl bg-white text-black hover:bg-white/90 transition-all hover:scale-105" })}
               >
                 Empezar ahora
               </Link>
             </div>
           </motion.div>
        </div>
      </section>

      <footer className="w-full border-t border-white/5 py-12 bg-black/50">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-black tracking-tighter text-white italic">QUEDAMOTO</span>
          </div>
          <div className="text-white/20 text-xs font-medium uppercase tracking-[0.25em]">
            © {new Date().getFullYear()} QuedaMoto. Engineered for high performance.
          </div>
        </div>
      </footer>
    </div>
  )
}
