import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MessageSquare, AlertTriangle } from "lucide-react"
import { format } from 'date-fns'
import { getRecentMessages } from "@/app/admin/actions"

export default function AdminMessagesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Gestión de Mensajes</h1>
      </div>

      <div className="bg-card border-border/50 rounded-lg p-8">
        <h2 className="text-xl font-bold text-white mb-4">Panel de Moderación de Mensajes</h2>
        <p className="text-white/60 mb-6">
          Supervisa y modera todos los mensajes de la plataforma.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Mensajes Hoy</h3>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-white/40">Próximamente disponible</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Mensajes Reportados</h3>
            <p className="text-3xl font-bold text-yellow-500">0</p>
            <p className="text-sm text-white/40">Próximamente disponible</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Mensajes Bloqueados</h3>
            <p className="text-3xl font-bold text-red-500">0</p>
            <p className="text-sm text-white/40">Próximamente disponible</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-2">🚧 Funcionalidad en Desarrollo</h4>
          <p className="text-white/60">
            El panel completo de moderación de mensajes estará disponible próximamente.
            Por ahora, puedes gestionar mensajes directamente desde la base de datos SQL.
          </p>
        </div>
      </div>
    </div>
  )
}