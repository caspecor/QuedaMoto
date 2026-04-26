'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/app/(main)/meetups/actions"
import { Pencil, Bike, Plus, Trash2, Instagram, Youtube, Share2, Image as ImageIcon, Camera } from "lucide-react"

export function BikeCard({ profile }: { profile: any }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Initialize vehicles array. Fallback to old moto_brand/model if vehicles array is empty/undefined.
  const initialVehicles = profile.vehicles && profile.vehicles.length > 0 
    ? profile.vehicles 
    : (profile.moto_brand ? [{ brand: profile.moto_brand, model: profile.moto_model || '' }] : []);

  const [vehicles, setVehicles] = useState<{brand: string, model: string, image?: string}[]>(initialVehicles)
  const [city, setCity] = useState(profile.city || '')
  const [level, setLevel] = useState(profile.level || '')
  const [style, setStyle] = useState(profile.style || '')
  const [bio, setBio] = useState(profile.bio || '')
  
  // Socials state
  const [instagram, setInstagram] = useState(profile.socials?.instagram || '')
  const [tiktok, setTiktok] = useState(profile.socials?.tiktok || '')
  const [youtube, setYoutube] = useState(profile.socials?.youtube || '')

  const handleAddVehicle = () => {
    setVehicles([...vehicles, { brand: '', model: '', image: '' }])
  }

  const handleRemoveVehicle = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index))
  }

  const handleVehicleChange = (index: number, field: 'brand' | 'model' | 'image', value: string) => {
    const newVehicles = [...vehicles]
    newVehicles[index][field] = value
    setVehicles(newVehicles)
  }

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 500000) { // 500KB limit for JSONB safety
      toast.error("La imagen es muy pesada. Máximo 500KB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      handleVehicleChange(index, 'image', reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Filter out completely empty vehicles before saving
    const validVehicles = vehicles.filter(v => v.brand.trim() !== '' || v.model.trim() !== '')

    const res = await updateProfile({
      vehicles: validVehicles,
      city: city,
      level: level,
      style: style,
      bio: bio,
      socials: {
        instagram: instagram.trim(),
        tiktok: tiktok.trim(),
        youtube: youtube.trim()
      }
    })
    
    if (res.success) {
      toast.success("Información actualizada")
      setIsEditing(false)
      router.refresh()
    } else {
      toast.error(res.error || "Error al actualizar")
    }
    setLoading(false)
  }

  if (isEditing) {
    return (
      <Card className="bg-card shadow-lg border-border/50 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Bike className="w-5 h-5 text-primary" /> Mi Garaje & Estilo
          </CardTitle>
          <p className="text-xs text-white/40">Actualiza los detalles de tus motos y tu estilo de conducción</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-primary">Mis Vehículos</Label>
              {vehicles.map((vehicle, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative group">
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] uppercase text-white/40">Marca</Label>
                    <Input value={vehicle.brand} onChange={e => handleVehicleChange(index, 'brand', e.target.value)} placeholder="Ej: Honda" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] uppercase text-white/40">Modelo</Label>
                    <Input value={vehicle.model} onChange={e => handleVehicleChange(index, 'model', e.target.value)} placeholder="Ej: CBR 600" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] uppercase text-white/40">Foto</Label>
                    <div className="flex gap-2">
                       <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => handleImageUpload(index, e)} 
                        className="hidden" 
                        id={`bike-photo-${index}`} 
                       />
                       <label 
                        htmlFor={`bike-photo-${index}`}
                        className="flex-1 flex items-center justify-center gap-2 h-10 rounded-md bg-white/5 border border-white/10 text-white/40 text-xs cursor-pointer hover:bg-white/10 transition-all"
                       >
                         {vehicle.image ? <ImageIcon className="w-4 h-4 text-primary" /> : <Camera className="w-4 h-4" />}
                         {vehicle.image ? 'Cambiar Foto' : 'Subir Foto'}
                       </label>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveVehicle(index)} className="md:mt-6 text-white/20 hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Button type="button" variant="outline" onClick={handleAddVehicle} className="w-full border-dashed border-white/10 text-white/50 hover:text-white hover:border-white/20 rounded-2xl h-12">
                <Plus className="w-4 h-4 mr-2" /> Añadir Moto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-white/40">Ciudad</Label>
                <Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="Ej: Madrid" className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level" className="text-xs font-bold uppercase tracking-widest text-white/40">Nivel</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principiante">Principiante</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="style" className="text-xs font-bold uppercase tracking-widest text-white/40">Estilo favorito</Label>
                <Input id="style" value={style} onChange={e => setStyle(e.target.value)} placeholder="Ej: Turismo, Enduro, Circuito..." className="bg-white/5 border-white/10 rounded-xl" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <Label className="text-xs font-bold uppercase tracking-widest text-primary">Redes Sociales</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-white/40 flex items-center gap-2">
                    <Instagram className="w-3 h-3" /> Instagram
                  </Label>
                  <Input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@usuario" className="bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-white/40 flex items-center gap-2">
                    <Share2 className="w-3 h-3" /> TikTok
                  </Label>
                  <Input value={tiktok} onChange={e => setTiktok(e.target.value)} placeholder="@usuario" className="bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-white/40 flex items-center gap-2">
                    <Youtube className="w-3 h-3" /> YouTube
                  </Label>
                  <Input value={youtube} onChange={e => setYoutube(e.target.value)} placeholder="Canal" className="bg-white/5 border-white/10 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-white/40">Bio</Label>
              <Input id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Cuéntanos sobre ti..." className="bg-white/5 border-white/10 rounded-xl" />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading} className="flex-1 rounded-xl bg-primary font-bold">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 rounded-xl">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  // Display mode
  const displayVehicles = profile.vehicles && profile.vehicles.length > 0 
    ? profile.vehicles 
    : (profile.moto_brand ? [{ brand: profile.moto_brand, model: profile.moto_model }] : []);

  const hasSocials = profile.socials?.instagram || profile.socials?.tiktok || profile.socials?.youtube;

  return (
    <Card className="bg-card shadow-lg border-border/50 rounded-3xl animate-reveal [animation-delay:0.1s]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bike className="w-5 h-5 text-primary" /> Mi Garaje & Estilo
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-full border-white/10 text-white hover:bg-white/5">
            <Pencil className="w-4 h-4 mr-2" /> Editar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {displayVehicles.length > 0 && (
            <div className="md:col-span-2 space-y-3">
              <p className="text-xs uppercase tracking-wider font-bold text-primary">Mis Vehículos</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayVehicles.map((v: any, i: number) => (
                  <div key={i} className="group overflow-hidden bg-white/[0.02] rounded-3xl border border-white/5 flex flex-col transition-all hover:bg-white/[0.04]">
                    {v.image ? (
                      <div className="h-40 w-full relative">
                        <img src={v.image} alt={v.brand} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-24 w-full flex items-center justify-center bg-white/[0.01] border-b border-white/5">
                        <Bike className="h-10 w-10 text-white/10" />
                      </div>
                    )}
                    <div className="p-4 flex items-center gap-3">
                      {!v.image && (
                         <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                            <Bike className="h-5 w-5 text-white/50" />
                         </div>
                      )}
                      <div>
                        <p className="font-black text-white text-base tracking-tight">{v.brand}</p>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{v.model}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-background p-4 rounded-xl border border-border/50">
            <p className="text-xs uppercase tracking-wider font-bold text-primary">Nivel</p>
            <p className="font-semibold text-lg mt-1">{profile.level || 'No definido'}</p>
          </div>
          
          <div className="bg-background p-4 rounded-xl border border-border/50">
            <p className="text-xs uppercase tracking-wider font-bold text-primary">Estilo favorito</p>
            <p className="font-semibold text-lg mt-1">{profile.style || 'No definido'}</p>
          </div>

          {hasSocials && (
            <div className="md:col-span-2 space-y-3">
              <p className="text-xs uppercase tracking-wider font-bold text-primary">Redes Sociales</p>
              <div className="flex flex-wrap gap-3">
                {profile.socials.instagram && (
                  <div className="bg-white/[0.02] px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 text-sm">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span className="font-bold text-white/80">{profile.socials.instagram}</span>
                  </div>
                )}
                {profile.socials.tiktok && (
                  <div className="bg-white/[0.02] px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 text-sm">
                    <Share2 className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white/80">{profile.socials.tiktok}</span>
                  </div>
                )}
                {profile.socials.youtube && (
                  <div className="bg-white/[0.02] px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 text-sm">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-white/80">{profile.socials.youtube}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {(profile.bio || profile.city) && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-xs uppercase tracking-wider font-bold text-primary mb-2">Bio</p>
              <div className="bg-background border border-border/50 p-4 rounded-xl text-sm leading-relaxed text-muted-foreground">
                {profile.city && <p className="mb-2"><span className="font-bold text-white">Ciudad:</span> {profile.city}</p>}
                {profile.bio ? profile.bio : <i className="text-white/20">Sin biografía</i>}
              </div>
            </div>
          )}
          
        </div>

        {displayVehicles.length === 0 && !profile.level && (
          <div className="text-center py-10 bg-background rounded-2xl border border-border/50 text-muted-foreground space-y-4">
            <Bike className="w-12 h-12 mx-auto text-white/20" />
            <p className="text-lg">Aún no has completado tu garaje.</p>
            <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-full border-2">
              Completar Perfil
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
