import { ReactNode } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { auth } from "@/auth"

import { NotificationListener } from "@/components/layout/NotificationListener"

export default async function MainLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      {user && <NotificationListener />}
      <Navbar user={user} />
      <main className="flex-1">
        {children}
      </main>
      <BottomNav isLoggedIn={!!user} />
    </div>
  )
}
