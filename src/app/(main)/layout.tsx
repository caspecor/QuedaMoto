import { ReactNode } from "react"
import Navbar from "@/components/layout/Navbar"
import BottomNav from "@/components/layout/BottomNav"
import { createClient } from "@/lib/supabase/server"

export default async function MainLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <BottomNav isLoggedIn={!!user} />
    </div>
  )
}
