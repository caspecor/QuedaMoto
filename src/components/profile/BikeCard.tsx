'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/app/(main)/meetups/actions"
import { Pencil, Bike } from "lucide-react"

export function BikeCard({ profile }: { profile: any }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [moto_brand, setMotoBrand] = useState(profile.moto_brand || '')
  const [moto_model, setMotoModel] = useState(profile.moto_model || '')
  const [city, setCity] = useState(profile.city || '')
  const [level, setLevel] = useState(profile.level || '')
  const [style, setStyle] = useState(profile.style || '')
  const [bio, setBio] = useState(profile.bio || '')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await updateProfile({
      moto_brand: moto_brand,
      moto_model: moto_model,
      city: city,
      level: level,
      style: style,
      bio: bio,
    })
    if (res.success) {
      toast.success("Información de moto actualizada")
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
            <Bike className="w-5 h-5 text-primary" /> Mi Moto
          </CardTitle>
          <p className="text-xs text-white/40">Actualiza los detalles de tu moto y tu estilo de conducción</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="moto_brand" className="text-xs font-bold uppercase tracking-widest text-white/40">Marca de la Moto</Label>
                <Input id="moto_brand" value={moto_brand} onChange={e => setMotoBrand(e.target.value)} placeholder="Ej: Honda" className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moto_model" className="text-xs font-bold uppercase tracking-widest text-white/40">Modelo</Label>
                <Input id="moto_model" value={moto_model} onChange={e => setMotoModel(e.target.value)} placeholder="Ej: CBR 600" className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-white/40">Ciudad</Label>
                <Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="Ej: Madrid" className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level" className="text-xs font-bold uppercase tracking-widest text-white/40">Nivel</Label>
                <Input id="level" value={level} onChange={e => setLevel(e.target.value)} placeholder="Ej: Intermedio" className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style" className="text-xs font-bold uppercase tracking-widest text-white/40">Estilo favorito</Label>
                <Input id="style" value={style} onChange={e => setStyle(e.target.value)} placeholder="Ej: Turismo" className="bg-white/5 border-white/10 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-white/40">Bio</Label>
              <Input id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Cuéntanos sobre ti y tu moto..." className="bg-white/5 border-white/10 rounded-xl" />
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

  return (
    <Card className="bg-card shadow-lg border-border/50 rounded-3xl">
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
      <CardContent className="space-y-4">
        {profile?.moto_brand ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-background p-4 rounded-xl border border-border/50">
              <p className="text-xs uppercase tracking-wider font-bold text-primary">Moto</p>
              <p className="font-semibold text-lg mt-1">{profile.moto_brand} {profile.moto_model}</p>
            </div>
            <div className="bg-background p-4 rounded-xl border border-border/50">
              <p className="text-xs uppercase tracking-wider font-bold text-primary">Nivel</p>
              <p className="font-semibold text-lg mt-1">{profile.level}</p>
            </div>
            <div className="col-span-2 bg-background p-4 rounded-xl border border-border/50">
              <p className="text-xs uppercase tracking-wider font-bold text-primary">Estilo favorito</p>
              <p className="font-semibold text-lg mt-1">{profile.style}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs uppercase tracking-wider font-bold text-primary mb-2">Bio</p>
              <p className="bg-background border border-border/50 p-4 rounded-xl text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-background rounded-2xl border border-border/50 text-muted-foreground space-y-4">
            <Bike className="w-12 h-12 mx-auto text-white/20" />
            <p className="text-lg">Aún no has completado la información de tu moto.</p>
            <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-full border-2">
              Completar Perfil
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
