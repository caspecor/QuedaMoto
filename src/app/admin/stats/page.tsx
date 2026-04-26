import { StatsPanel } from "@/components/admin/StatsPanel"

export const metadata = {
  title: "Estadísticas - Admin",
}

export default function AdminStatsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">ANALYTICS & STATS</h1>
          <p className="text-white/40 mt-2 font-medium">Monitoreo de tráfico y comportamiento de usuarios</p>
        </div>
      </div>

      <StatsPanel />
    </div>
  )
}
