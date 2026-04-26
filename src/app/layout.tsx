import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { VisitTracker } from "@/components/layout/VisitTracker";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await db.select().from(settings).where(eq(settings.key, 'site_title')).limit(1)
    const title = res[0]?.value || "QuedaMoto"
    const favRes = await db.select().from(settings).where(eq(settings.key, 'site_favicon')).limit(1)
    const favicon = favRes[0]?.value

    return {
      title: {
        default: title,
        template: `%s | ${title}`,
      },
      description: "La plataforma para los amantes de las motos",
      icons: favicon ? [{ rel: 'icon', url: favicon }] : undefined,
    }
  } catch (e) {
    return {
      title: "QuedaMoto",
      description: "La plataforma para los amantes de las motos",
    }
  }
}

import { SessionProvider } from "next-auth/react"
import { db } from "@/db"
import { settings } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settingsData: Record<string, string> = {}
  try {
    const res = await db.select().from(settings)
    res.forEach(s => {
      settingsData[s.key] = s.value || ''
    })
  } catch (e) {
    // Table might not exist yet or other DB error
  }

  const gscCode = settingsData.google_search_console
  const siteTitle = settingsData.site_title || "QuedaMoto"
  const siteFavicon = settingsData.site_favicon

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {gscCode && (
          gscCode.startsWith('<') 
            ? <script dangerouslySetInnerHTML={{ __html: gscCode }} />
            : <meta name="google-site-verification" content={gscCode} />
        )}
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SessionProvider>
          <VisitTracker />
          {children}
        </SessionProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
