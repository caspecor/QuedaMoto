'use client'

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getBanners, createBanner, updateBanner, deleteBanner, toggleBannerStatus, getAllBannerModulesStatus, toggleBannerModule } from "./actions"
import { toast } from "sonner"
import { Image as ImageIcon, Link as LinkIcon, Trash2, Power, Plus, Loader2, Pencil } from "lucide-react"
import { format } from "date-fns"

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [moduleStatus, setModuleStatus] = useState({ home_middle: true, home_middle_2: true, home_footer: true })

  // Form states
  const [title, setTitle] = useState("")
  const [badgeText, setBadgeText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [position, setPosition] = useState("home_middle")
  const [slotIndex, setSlotIndex] = useState(1)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadBanners()
  }, [])

  async function loadBanners() {
    setLoading(true)
    const [data, status] = await Promise.all([
      getBanners(),
      getAllBannerModulesStatus()
    ])
    setBanners(data)
    setModuleStatus(status)
    setLoading(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 500000) {
      toast.error("La imagen es muy pesada. Máximo 500KB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImageBase64(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      toast.error("El Título es requerido")
      return
    }
    if (!editingId && !imageBase64) {
      toast.error("La Imagen es requerida para un nuevo banner")
      return
    }

    setSubmitting(true)
    let res;
    if (editingId) {
      res = await updateBanner(editingId, {
        title,
        badgeText,
        imageUrl: imageBase64 || undefined,
        linkUrl,
        position,
        slotIndex
      })
    } else {
      res = await createBanner({
        title,
        badgeText,
        imageUrl: imageBase64 as string,
        linkUrl,
        position,
        slotIndex
      })
    }
    
    if (res.success) {
      toast.success(editingId ? "Banner actualizado correctamente" : "Banner creado correctamente")
      cancelEditing()
      loadBanners()
    } else {
      toast.error(res.error)
    }
    setSubmitting(false)
  }

  const handleEdit = (b: any) => {
    setEditingId(b.id)
    setTitle(b.title)
    setBadgeText(b.badgeText || "")
    setLinkUrl(b.linkUrl || "")
    setPosition(b.position)
    setSlotIndex(b.slotIndex)
    setImageBase64(null)
    setIsCreating(true)
  }

  const cancelEditing = () => {
    setIsCreating(false)
    setEditingId(null)
    setTitle("")
    setBadgeText("")
    setLinkUrl("")
    setImageBase64(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este banner?")) return
    const res = await deleteBanner(id)
    if (res.success) {
      toast.success("Eliminado")
      loadBanners()
    } else {
      toast.error(res.error)
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await toggleBannerStatus(id, currentStatus)
    if (res.success) {
      toast.success(currentStatus ? "Banner desactivado" : "Banner activado")
      loadBanners()
    } else {
      toast.error(res.error)
    }
  }

  const handleToggleModule = async (position: string, currentStatus: boolean) => {
    const res = await toggleBannerModule(position, !currentStatus)
    if (res.success) {
      toast.success(currentStatus ? "Módulo desactivado" : "Módulo activado")
      setModuleStatus(prev => ({ ...prev, [position]: !currentStatus }))
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">BANNERS & SPONSORS</h1>
          <p className="text-white/40 mt-2 font-medium">Gestiona la publicidad de la plataforma</p>
        </div>
        {!isCreating && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-12 px-6 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" /> Añadir Banner
          </Button>
        )}
      </div>

      {!isCreating && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className={`border-white/10 rounded-[2rem] overflow-hidden transition-colors ${moduleStatus.home_middle ? 'bg-white/5 border-primary/30' : 'bg-black/50'}`}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-sm">Módulo: Arriba (Centro)</h3>
                <p className="text-xs text-white/40 mt-1">Habilita o deshabilita los 8 huecos superiores.</p>
              </div>
              <Button 
                variant={moduleStatus.home_middle ? "default" : "outline"}
                onClick={() => handleToggleModule('home_middle', moduleStatus.home_middle)}
                className={`h-10 rounded-xl font-bold text-xs border-white/10 ${moduleStatus.home_middle ? 'bg-primary text-white hover:bg-primary/80' : 'text-white/40 hover:text-white'}`}
              >
                <Power className="w-3 h-3 mr-2" />
                {moduleStatus.home_middle ? 'Activado' : 'Desactivado'}
              </Button>
            </CardContent>
          </Card>

          <Card className={`border-white/10 rounded-[2rem] overflow-hidden transition-colors ${moduleStatus.home_middle_2 ? 'bg-white/5 border-primary/30' : 'bg-black/50'}`}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-sm">Módulo: Arriba (Fila 2)</h3>
                <p className="text-xs text-white/40 mt-1">Habilita o deshabilita la 2º fila de 4 huecos.</p>
              </div>
              <Button 
                variant={moduleStatus.home_middle_2 ? "default" : "outline"}
                onClick={() => handleToggleModule('home_middle_2', moduleStatus.home_middle_2)}
                className={`h-10 rounded-xl font-bold text-xs border-white/10 ${moduleStatus.home_middle_2 ? 'bg-primary text-white hover:bg-primary/80' : 'text-white/40 hover:text-white'}`}
              >
                <Power className="w-3 h-3 mr-2" />
                {moduleStatus.home_middle_2 ? 'Activado' : 'Desactivado'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className={`border-white/10 rounded-[2rem] overflow-hidden transition-colors ${moduleStatus.home_footer ? 'bg-white/5 border-primary/30' : 'bg-black/50'}`}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-sm">Módulo: Abajo (Footer)</h3>
                <p className="text-xs text-white/40 mt-1">Habilita o deshabilita los 4 huecos inferiores.</p>
              </div>
              <Button 
                variant={moduleStatus.home_footer ? "default" : "outline"}
                onClick={() => handleToggleModule('home_footer', moduleStatus.home_footer)}
                className={`h-10 rounded-xl font-bold text-xs border-white/10 ${moduleStatus.home_footer ? 'bg-primary text-white hover:bg-primary/80' : 'text-white/40 hover:text-white'}`}
              >
                <Power className="w-3 h-3 mr-2" />
                {moduleStatus.home_footer ? 'Activado' : 'Desactivado'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {isCreating && (
        <Card className="bg-card border-white/10 rounded-[2.5rem] overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-xl font-black italic uppercase">Nuevo Espacio Publicitario</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Título Interno</Label>
                  <Input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Campaña Navidad"
                    className="bg-white/5 border-white/10 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Nombre de Empresa (Etiqueta)</Label>
                  <Input 
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="Ej. Monster Energy (se verá en el banner)"
                    className="bg-white/5 border-white/10 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Zona de Visualización</Label>
                  <Select value={position} onValueChange={(val) => val && setPosition(val)}>
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white rounded-xl">
                      <SelectItem value="home_middle">Portada (Arriba Fila 1 - 4 espacios)</SelectItem>
                      <SelectItem value="home_middle_2">Portada (Arriba Fila 2 - 4 espacios)</SelectItem>
                      <SelectItem value="home_footer">Portada (Abajo - 4 espacios)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Posición (Hueco)</Label>
                  <Select value={slotIndex.toString()} onValueChange={(val) => val && setSlotIndex(parseInt(val))}>
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white rounded-xl">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <SelectItem key={i+1} value={(i+1).toString()}>Hueco {i+1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Enlace (Opcional)</Label>
                  <Input 
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-white/5 border-white/10 rounded-xl text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Imagen (Max 500KB)</Label>
                  <div className="flex gap-4 items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-10 px-4 rounded-xl"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" /> Subir Imagen
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {imageBase64 && <span className="text-xs font-bold text-green-400">Imagen cargada ✓</span>}
                  </div>
                </div>
              </div>

              {imageBase64 && (
                <div className="mt-4 border border-white/10 rounded-2xl overflow-hidden bg-black/50 p-2 w-full max-w-md">
                  <img src={imageBase64} alt="Preview" className="w-full h-auto object-cover rounded-xl" />
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsCreating(false)}
                  className="text-white/40 hover:text-white uppercase font-bold text-xs"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-white text-black font-black uppercase tracking-widest hover:bg-white/90 rounded-xl"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Banner"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-white/10 rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-20 text-center text-white/40 uppercase tracking-widest text-xs font-bold animate-pulse">
              Cargando banners...
            </div>
          ) : banners.length === 0 ? (
            <div className="p-20 text-center text-white/20 font-black uppercase tracking-[0.2em] text-sm">
              No hay banners configurados
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
              {banners.map((b) => (
                <div key={b.id} className="relative group bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/20 transition-all flex flex-col">
                  <div className="h-40 bg-black/50 w-full overflow-hidden relative">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {!b.isActive && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500/20 text-red-400 font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full border border-red-500/30">
                          Inactivo
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                        {b.position === 'home_middle' ? 'Arriba' : 'Abajo'} - Hueco {b.slotIndex}
                      </span>
                      <span className="text-[10px] font-bold text-white/30">
                        {b.clicks} clics • {format(new Date(b.createdAt), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white leading-tight mb-2">{b.title}</h3>
                    {b.linkUrl && (
                      <a href={b.linkUrl} target="_blank" rel="noreferrer" className="flex items-center text-xs text-blue-400 hover:text-blue-300 font-bold mb-4 line-clamp-1 break-all">
                        <LinkIcon className="w-3 h-3 mr-1 shrink-0" /> {b.linkUrl}
                      </a>
                    )}
                    
                    <div className="mt-auto flex gap-2 pt-4 border-t border-white/5">
                      <Button 
                        onClick={() => handleToggle(b.id, b.isActive)}
                        variant="outline" 
                        className={`flex-1 h-10 rounded-xl text-xs font-bold border-white/10 ${b.isActive ? 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' : 'hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20'}`}
                      >
                        <Power className="w-3 h-3 mr-2" />
                        {b.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button 
                        onClick={() => handleEdit(b)}
                        variant="outline" 
                        className="h-10 w-10 p-0 rounded-xl border-white/10 text-white/40 hover:bg-white/10 hover:text-white shrink-0"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(b.id)}
                        variant="outline" 
                        className="h-10 w-10 p-0 rounded-xl border-white/10 text-white/40 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
