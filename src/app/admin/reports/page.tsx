import { ReportsTable } from "@/components/admin/ReportsTable"

export const metadata = {
  title: "Reportes e Incidencias - Admin",
}

export default function AdminReportsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">INCIDENCIAS</h1>
        <p className="text-white/40 mt-2 font-medium">Gestiona los reportes de comportamiento y seguridad de la comunidad</p>
      </div>

      <ReportsTable />
    </div>
  )
}
