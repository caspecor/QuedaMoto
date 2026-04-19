'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Camera, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { updateProfile, updatePassword } from "@/app/(main)/meetups/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export function ProfileEditForm({ profile }: { profile: any }) {
  const router = useRouter()
  const { update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  
  // Profile state
  const [username, setUsername] = useState(profile.username || '')
  const [avatar, setAvatar] = useState(profile.avatar || '')
  
  // Password state
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande (máx 2MB)")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatar(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await updateProfile({ name: username, avatar })
    
    if (res.success) {
      // Trigger session update for real-time changes in Navbar
      console.log("[PROFILE_EDIT] Calling update() with:", { name: username, hasImage: !!avatar })
      await update({
        name: username,
        image: avatar
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
    
    setLoading(true)
    const res = await updatePassword(oldPass, newPass)
    setLoading(false)

    if (res.success) {
      toast.success("Contraseña actualizada")
      setShowPasswordFields(false)
      setOldPass('')
      setNewPass('')
      setConfirmPass('')
    } else {
      toast.error(res.error || "Error al cambiar contraseña")
    }
  }

  if (!isEditing) {
    return (
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(true)}
          className="rounded-xl border-white/10 glass hover:bg-white/10"
        >
          <Settings className="w-4 h-4 mr-2" /> Editar Perfil
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" /> Ajustes de Cuenta
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-white/40 hover:text-white">
          Cancelar
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Profile Info Form */}
        <form onSubmit={handleProfileUpdate} className="space-y-6 bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group italic">
              <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-2xl transition-all group-hover:border-primary/40">
                <AvatarImage src={avatar} className="object-cover" />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary font-black uppercase">
                  {username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-all border-4 border-[#030303]"
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
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-white/40">Alias / Nombre</Label>
                <Input 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tu nombre rider"
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 text-white font-bold"
                />
              </div>
              <p className="text-[10px] text-white/20 font-medium">Este es el nombre que verán otros usuarios en las quedadas y el chat.</p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-bold bg-white text-black hover:bg-white/90">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
          </Button>
        </form>

        {/* Password Management */}
        <div className="space-y-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">Seguridad</h4>
                <p className="text-xs text-white/40">Cambia tu contraseña de acceso</p>
              </div>
            </div>
            {!showPasswordFields && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPasswordFields(true)}
                className="rounded-lg border-white/10 hover:bg-white/5 text-xs h-9"
              >
                Cambiar contraseña
              </Button>
            )}
          </div>

          {showPasswordFields && (
            <form onSubmit={handlePasswordUpdate} className="pt-4 space-y-4 animate-reveal">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Contraseña Actual</Label>
                  <Input 
                    type="password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-xl h-11"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nueva Contraseña</Label>
                    <Input 
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Confirmar</Label>
                    <Input 
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl h-11"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading} className="flex-1 h-11 rounded-xl bg-primary font-bold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar Contraseña"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowPasswordFields(false)}
                  className="h-11 rounded-xl"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
