import { ReactNode } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { auth } from "@/auth"

import { NotificationListener } from "@/components/layout/NotificationListener"
import { SuspensionOverlay } from "@/components/layout/SuspensionOverlay"
import { db } from "@/db"
import { users, settings } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function MainLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const user = session?.user

  let suspendedUntil = null
  if (user?.id) {
    const [dbUser] = await db.select({
      suspendedUntil: users.suspendedUntil,
      isBlocked: users.isBlocked
    }).from(users).where(eq(users.id, user.id)).limit(1)

    if (dbUser?.isBlocked) {
      redirect('/auth/logout') // Or a blocked page
    }

    if (dbUser?.suspendedUntil && new Date(dbUser.suspendedUntil) > new Date()) {
      suspendedUntil = dbUser.suspendedUntil.toISOString()
    }
  }

  // Fetch Site Settings for Branding
  const settingsRes = await db.select().from(settings)
  const branding = {
    logo: settingsRes.find(s => s.key === 'site_logo')?.value || '',
    title: settingsRes.find(s => s.key === 'site_name')?.value || settingsRes.find(s => s.key === 'site_title')?.value || 'QuedaMoto'
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      {user && <NotificationListener />}
      {suspendedUntil && <SuspensionOverlay suspendedUntil={suspendedUntil} />}
      <Navbar user={user} isSuspended={!!suspendedUntil} branding={branding} />
      <main className="flex-1">
        {children}
      </main>
      <BottomNav user={user} isSuspended={!!suspendedUntil} branding={branding} />
    </div>
  )
}
