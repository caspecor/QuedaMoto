import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 bg-background">
      <div className="flex flex-col p-8 md:p-12 relative">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Zap className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight text-white">QuedaMoto</span>
        </Link>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm space-y-6">
            {children}
          </div>
        </div>
      </div>
      <div className="hidden relative bg-muted md:block">
        <Image
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070"
          alt="Motorcycle on a dark road"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-bold font-sans">Encuentra tu ruta.</h2>
          <p className="mt-2 text-lg text-gray-400">La comunidad de moteros más grande de España.</p>
        </div>
      </div>
    </div>
  )
}
