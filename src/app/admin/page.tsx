import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, MessageSquare, AlertTriangle } from "lucide-react"
import { getAdminStats } from "@/app/admin/actions"

export const metadata = {
  title: "Panel de Administración - QuedaMoto",
}

export default async function AdminDashboard() {
  // Temporarily simplified to fix build
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Panel de Administración</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border-border/50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-white/60 mb-2">Total Usuarios</h3>
          <div className="text-2xl font-bold text-white">0</div>
          <p className="text-xs text-white/40">Próximamente disponible</p>
        </div>

        <div className="bg-card border-border/50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-white/60 mb-2">Quedadas Activas</h3>
          <div className="text-2xl font-bold text-white">0</div>
          <p className="text-xs text-white/40">Próximamente disponible</p>
        </div>

        <div className="bg-card border-border/50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-white/60 mb-2">Mensajes Hoy</h3>
          <div className="text-2xl font-bold text-white">0</div>
          <p className="text-xs text-white/40">Próximamente disponible</p>
        </div>

        <div className="bg-card border-border/50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-white/60 mb-2">Usuarios Bloqueados</h3>
          <div className="text-2xl font-bold text-white">0</div>
          <p className="text-xs text-white/40">Próximamente disponible</p>
        </div>
      </div>

      <div className="bg-card border-border/50 rounded-lg p-8">
        <h2 className="text-lg font-bold text-white mb-4">Funcionalidades Próximamente Disponibles</h2>
        <ul className="text-white/60 space-y-2">
          <li>• Gestión completa de usuarios (bloquear, cambiar roles, eliminar)</li>
          <li>• Moderación de quedadas y mensajes</li>
          <li>• Estadísticas en tiempo real del sitio</li>
          <li>• Logs de actividad y alertas automáticas</li>
        </ul>
      </div>
    </div>
  )
}