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
  const { meetups } = await getAllMeetups()

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Badge variant="outline" className="text-green-500 border-green-500">Público</Badge>
      case 'private':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Privado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Gestión de Quedadas</h1>
        <Badge variant="outline" className="text-white/60">
          {meetups.length} quedadas totales
        </Badge>
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-white">Todas las Quedadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white/60">Quedada</TableHead>
                <TableHead className="text-white/60">Organizador</TableHead>
                <TableHead className="text-white/60">Fecha</TableHead>
                <TableHead className="text-white/60">Participantes</TableHead>
                <TableHead className="text-white/60">Visibilidad</TableHead>
                <TableHead className="text-white/60">Ubicación</TableHead>
                <TableHead className="text-white/60">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetups.map((meetup) => (
                <TableRow key={meetup.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{meetup.title}</div>
                      <div className="text-sm text-white/60 line-clamp-2">
                        {meetup.description?.substring(0, 100)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/60">
                    {meetup.creator?.username || 'Usuario eliminado'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-white/60">{meetup.date}</span>
                    </div>
                    <div className="text-sm text-white/40">{meetup.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-white/60">
                        {meetup.attendeesCount || 0}/{meetup.max_attendees}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getVisibilityBadge(meetup.visibility || 'public')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-white/60 text-sm">
                        {meetup.address?.substring(0, 30)}...
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border/50">
                        <DropdownMenuItem className="text-white/60 hover:text-white">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white/60 hover:text-white">
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}