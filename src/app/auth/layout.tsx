import { ReactNode } from "react"
import Link from "next/link"
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
    <div className="min-h-screen bg-[#111] relative flex flex-col">
      {/* Navbar with Logo */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 pointer-events-none">
        <Link href="/" className="inline-flex items-center gap-3 pointer-events-auto">
          <img src={branding.logo} alt={branding.title} className="h-16 w-16 object-contain drop-shadow-md" />
          <span className="text-xl md:text-2xl font-black italic tracking-tighter text-white">
            {branding.title}
          </span>
        </Link>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex justify-center items-center p-4">
        {children}
      </div>
    </div>
  )
}
