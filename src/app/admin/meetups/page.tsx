import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, MapPin, Users, Eye, Trash2 } from "lucide-react"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getAllMeetups } from "@/app/admin/actions"

export default async function AdminMeetupsPage() {
  // Temporarily simplified to fix build
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Gestión de Quedadas</h1>
      </div>

      <div className="bg-card border-border/50 rounded-lg p-8">
        <p className="text-white/60">Panel de administración de quedadas próximamente disponible.</p>
      </div>
    </div>
  )
}