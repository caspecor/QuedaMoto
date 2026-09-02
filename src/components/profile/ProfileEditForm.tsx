'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Camera, Lock, CheckCircle2, AlertCircle, Loader2, Pencil, X, Phone, User, Compass, KeyRound } from "lucide-react"
import { updateProfile, updatePassword } from "@/app/(main)/meetups/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { RIDING_STYLES } from "@/lib/gamification"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

export function ProfileEditForm({ profile }: { profile: any }) {
  const router = useRouter()
  const { update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  
  // Profile state
  const [username, setUsername] = useState(profile.username || '')
  const [avatar, setAvatar] = useState(profile.avatar || '')
  const [style, setStyle] = useState(profile.style || '')
  const [phone, setPhone] = useState(profile.phone || '')
  
  // Password state
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande (máx 2MB)")
      return
    }

    try {
      setLoading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `avatars/${profile.id}-${Date.now()}.${fileExt}`

      const { data: uploadData, error } = await supabase.storage
        .from('data')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('data')
        .getPublicUrl(fileName)

      setAvatar(publicUrl)
      toast.success("Foto de avatar subida correctamente")
    } catch (error: any) {
      toast.error("Error al subir imagen: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await updateProfile({ name: username, avatar, style, phone })
    
    if (res.success) {
      console.log("[PROFILE_EDIT] Calling update() with name only:", username)
      await update({
        name: username
      })

      toast.success("Perfil actualizado correctamente")
      setIsEditing(false)
      router.refresh()
    } else {
      toast.error(res.error || "Error al actualizar")
    }
    setLoading(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirmPass) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    if (newPass.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }
    
    setLoading(true)
    const res = await updatePassword(oldPass, newPass)
    setLoading(false)

    if (res.success) {
      toast.success("Contraseña actualizada con éxito")
      setShowPasswordFields(false)
      setOldPass('')
      setNewPass('')
      setConfirmPass('')
    } else {
      toast.error(res.error || "Error al cambiar contraseña")
    }
  }

  return (
    <Card className="bg-card shadow-xl border border-white/8 rounded-3xl overflow-hidden">
      <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <Settings className="w-5 h-5 text-primary" /> Datos de Cuenta & Seguridad
          </CardTitle>
          <p className="text-xs text-white/40 mt-1 font-medium">
            Nombre público, teléfono de contacto y contraseña de inicio de sesión.
          </p>
        </div>

        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)} 
            className="rounded-xl border-white/10 text-white hover:bg-white/10 font-bold text-xs h-10 px-4 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 mr-2 text-primary" /> Editar Datos
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(false)} 
            className="rounded-xl text-white/40 hover:text-white text-xs h-10 px-3 cursor-pointer"
          >
            <X className="w-4 h-4 mr-1" /> Cancelar
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-8">
        {!isEditing ? (
          /* READ-ONLY OVERVIEW MODE */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <User className="h-3 w-3 text-primary" /> Alias / Rider
              </span>
              <p className="text-base font-extrabold text-white truncate">
                {profile.username || 'Sin definir'}
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-primary" /> Teléfono Privado
              </span>
              <p className="text-base font-extrabold text-white truncate">
                {profile.phone || 'No configurado'}
              </p>
              <span className="text-[9px] text-white/30 block">Solo visible para el sistema</span>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <Compass className="h-3 w-3 text-primary" /> Estilo de Rodada
              </span>
              <p className="text-base font-extrabold text-white truncate">
                {profile.style ? RIDING_STYLES.find(s => s.value === profile.style)?.label || profile.style : 'No definido'}
              </p>
            </div>
          </div>
        ) : (
          /* EDITING FORM MODE */
          <form onSubmit={handleProfileUpdate} className="space-y-6 animate-reveal">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white/[0.02] p-5 sm:p-6 rounded-2xl border border-white/5">
              <div className="relative group shrink-0">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-primary/20 shadow-xl overflow-hidden ring-2 ring-black">
                  <AvatarImage src={avatar} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary font-black uppercase">
                    {username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 bg-primary text-black rounded-full shadow-lg hover:scale-110 transition-all border-2 border-[#121212] cursor-pointer"
                  title="Cambiar foto de perfil"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs font-bold text-white/80">
                      Alias / Nombre de Rider
                    </Label>
                    <Input 
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Tu nombre rider"
                      className="h-11 bg-white/[0.03] border-white/10 rounded-xl text-white font-bold text-sm"
                    />
                    <p className="text-[10px] text-white/30">Visible en las quedadas y en el chat.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-white/80">
                      Teléfono de Contacto <span className="text-white/30 font-normal">(Privado)</span>
                    </Label>
                    <Input 
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 600123456"
                      className="h-11 bg-white/[0.03] border-white/10 rounded-xl text-white font-bold text-sm"
                    />
                    <p className="text-[10px] text-white/30">Solo para notificaciones administrativas.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style" className="text-xs font-bold text-white/80">
                    Estilo de Conducción
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="w-full h-11 bg-white/[0.03] border-white/10 rounded-xl text-white font-bold text-xs sm:text-sm">
                      <SelectValue placeholder="Selecciona tu estilo de rodada" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/10 text-white rounded-xl">
                      {RIDING_STYLES.map((s) => (
                        <SelectItem key={s.value} value={s.value} className="focus:bg-primary/20 focus:text-white rounded-lg">
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)} 
                className="h-11 px-5 rounded-xl border-white/10 text-white hover:bg-white/5 cursor-pointer text-xs"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="h-11 px-6 rounded-xl font-bold bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20 cursor-pointer text-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        )}

        {/* Password Management Section */}
        <div className="bg-white/[0.02] border border-white/5 p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm sm:text-base">Seguridad y Contraseña</h4>
                <p className="text-xs text-white/40">Mantén protegida tu cuenta de acceso a QuedaMoto</p>
              </div>
            </div>

            {!showPasswordFields && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPasswordFields(true)}
                className="rounded-xl border-white/10 hover:bg-white/5 text-xs h-9 px-3.5 cursor-pointer"
              >
                Cambiar contraseña
              </Button>
            )}
          </div>

          {showPasswordFields && (
            <form onSubmit={handlePasswordUpdate} className="pt-3 space-y-4 border-t border-white/5 animate-reveal">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-white/80">Contraseña Actual</Label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="bg-white/[0.03] border-white/10 rounded-xl h-10 text-white text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-white/80">Nueva Contraseña</Label>
                  <Input 
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="bg-white/[0.03] border-white/10 rounded-xl h-10 text-white text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-white/80">Confirmar Nueva</Label>
                  <Input 
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="bg-white/[0.03] border-white/10 rounded-xl h-10 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPasswordFields(false)}
                  className="h-10 px-4 rounded-xl text-white/40 hover:text-white text-xs cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={loading} 
                  className="h-10 px-5 rounded-xl bg-primary font-bold text-black hover:bg-primary/90 text-xs cursor-pointer shadow-md shadow-primary/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                  Actualizar Contraseña
                </Button>
              </div>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
