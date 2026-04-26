import { SettingsPanel } from "@/components/admin/SettingsPanel"

export const metadata = {
  title: "Configuración - Admin",
}

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">CONFIGURACIÓN</h1>
        <p className="text-white/40 mt-2 font-medium">Gestiona los ajustes globales de QuedaMoto</p>
      </div>

      <SettingsPanel />
    </div>
  )
}
