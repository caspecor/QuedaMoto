import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { VisitTracker } from "@/components/layout/VisitTracker";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const dynamic = 'force-dynamic'

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
    const gscRes = await db.select().from(settings).where(eq(settings.key, 'google_search_console')).limit(1)
    const gscCode = gscRes[0]?.value

    return {
      metadataBase: new URL('https://quedamoto.vercel.app'),
      title: {
        default: title,
        template: `%s | ${title}`,
      },
      description: "La plataforma para los amantes de las motos en Canarias y España. Encuentra rutas, conoce a otros moteros y organiza quedadas.",
      keywords: ["rutas en moto Canarias", "quedadas moteras España", "moteros Canarias", "rutas moto", "comunidad motera", "eventos moteros", "QuedaMoto"],
      authors: [{ name: 'QuedaMoto Team', url: 'https://quedamoto.vercel.app' }],
      creator: 'QuedaMoto',
      publisher: 'QuedaMoto',
      alternates: {
        canonical: '/',
      },
      openGraph: {
        title: title,
        description: "La plataforma para los amantes de las motos en Canarias y España. Encuentra rutas, conoce a otros moteros y organiza quedadas.",
        url: 'https://quedamoto.vercel.app',
        siteName: title,
        locale: 'es_ES',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: "La plataforma para los amantes de las motos en Canarias y España. Encuentra rutas, conoce a otros moteros y organiza quedadas.",
      },
      icons: favicon ? [{ rel: 'icon', url: favicon }] : undefined,
      verification: {
        google: gscCode?.includes('google-site-verification') 
          ? gscCode.split('=')[1] 
          : (gscCode || '0PFknYWVYkT0rHw1QDQxdcjIYoXq_QAdtnliZ-JZ4mo'),
      }
    }
  } catch (e) {
    return {
      metadataBase: new URL('https://quedamoto.vercel.app'),
      title: "QuedaMoto",
      description: "La plataforma para los amantes de las motos en Canarias y España.",
      keywords: ["rutas en moto Canarias", "quedadas moteras España", "moteros Canarias", "rutas moto", "comunidad motera"],
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
