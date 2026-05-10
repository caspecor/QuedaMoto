import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/db"
import { settings } from "@/db/schema"

export default async function AuthLayout({ children }: { children: ReactNode }) {
  // Fetch Site Settings for Branding
  const settingsRes = await db.select().from(settings)
  const branding = {
    logo: settingsRes.find(s => s.key === 'site_logo')?.value || '/logo.png',
    title: settingsRes.find(s => s.key === 'site_name')?.value || settingsRes.find(s => s.key === 'site_title')?.value || 'QuedaMoto'
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left side: Form */}
      <div className="flex flex-col relative bg-[#111]">
        {/* Navbar with Logo */}
        <div className="absolute top-0 left-0 w-full p-6 z-50 pointer-events-none">
          <Link href="/" className="inline-flex items-center gap-3 pointer-events-auto group">
            <div className="h-16 w-16 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <img src={branding.logo} alt={branding.title} className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="text-xl md:text-2xl font-black italic tracking-tighter text-white">
              {branding.title}
            </span>
          </Link>
        </div>
        
        {/* Centered Content */}
        <div className="flex-1 flex justify-center items-center p-4 pt-24 pb-8 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden relative lg:block bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070"
          alt="Motorcycle on a dark road"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-12 left-12 text-white max-w-xl">
          <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase drop-shadow-lg">
            Encuentra tu ruta.
          </h2>
          <p className="mt-4 text-xl text-white/80 font-medium">
            La comunidad de moteros más grande de España.
          </p>
        </div>
      </div>
    </div>
  )
}
