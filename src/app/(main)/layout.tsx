import { ReactNode } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { auth } from "@/auth"

import { NotificationListener } from "@/components/layout/NotificationListener"
import { SuspensionOverlay } from "@/components/layout/SuspensionOverlay"

export default async function MainLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      {user && <NotificationListener />}
      {/* @ts-ignore */}
      {user?.suspendedUntil && <SuspensionOverlay suspendedUntil={user.suspendedUntil} />}
      <Navbar user={user} />
      <main className="flex-1">
        {children}
      </main>
      <BottomNav user={user} />
    </div>
  )
}
