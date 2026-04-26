'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createReportAction } from "@/app/actions/moderation"
import { toast } from "sonner"
import { AlertTriangle, Flag } from "lucide-react"

export function ReportUserModal({ reportedId, username, meetupId }: { reportedId: string, username: string, meetupId?: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("conducta_inapropiada")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const res = await createReportAction({
      reportedId,
      meetupId,
      reason,
      description
    })

    if (res.success) {
      toast.success("Reporte enviado correctamente. Lo revisaremos pronto.")
      setOpen(false)
      setDescription("")
    } else {
      toast.error(res.error || "Error al enviar el reporte")
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <button className="flex items-center gap-2 text-xs font-bold text-red-500/60 hover:text-red-500 transition-colors">
            <Flag className="h-3 w-3" />
            Reportar
          </button>
        }
      />
      <DialogContent className="bg-card border-white/5 rounded-[2rem] max-w-md">
        <DialogHeader>
          <div className="h-12 w-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-black italic">REPORTAR USUARIO</DialogTitle>
          <DialogDescription className="text-white/40">
            Estás reportando a <span className="text-white font-bold">@{username}</span>. 
            Por favor, indica el motivo para que podamos tomar medidas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Motivo del Reporte</Label>
            <Select value={reason} onValueChange={(val) => setReason(val || "otro")}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                <SelectValue placeholder="Selecciona un motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conducta_inapropiada">Conducta inapropiada</SelectItem>
                <SelectItem value="insultos_amenazas">Insultos o amenazas</SelectItem>
                <SelectItem value="spam_estafa">Spam o estafa</SelectItem>
                <SelectItem value="contenido_ofensivo">Contenido ofensivo</SelectItem>
                <SelectItem value="otro">Otro motivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Detalles adicionales</Label>
            <Textarea 
              placeholder="Explica brevemente qué ha sucedido..."
              className="bg-white/5 border-white/10 rounded-xl min-h-[100px] resize-none focus:ring-red-500/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold">Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white font-black uppercase text-xs tracking-widest px-8 h-12 rounded-xl"
          >
            {loading ? "Enviando..." : "Enviar Reporte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
