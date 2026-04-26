'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSiteSettings, updateSiteSettings } from "@/app/admin/actions"
import { toast } from "sonner"
import { Save, Search, Layout, Upload } from "lucide-react"

export function SettingsPanel() {
  const [config, setConfig] = useState<Record<string, string>>({
    google_search_console: "",
    site_title: "QuedaMoto",
    site_logo: "",
    site_favicon: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleUpload = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setConfig(prev => ({ ...prev, [key]: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    async function load() {
      const data = await getSiteSettings()
      setConfig(prev => ({ ...prev, ...data }))
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const res = await updateSiteSettings(config)
    if (res.success) {
      toast.success("Configuración guardada")
    } else {
      toast.error(res.error || "Error al guardar")
    }
    setSaving(false)
  }

  if (loading) return <div className="p-8 text-white/40">Cargando configuración...</div>

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Identidad del Sitio */}
      <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden">
        <CardHeader className="bg-white/[0.02] border-b border-white/5 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Layout className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">Identidad del Sitio</CardTitle>
          </div>
          <CardDescription className="text-white/40 text-sm">
            Personaliza el nombre, logo e icono de tu plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-white/60">Título de la Web</Label>
              <Input
                id="title"
                value={config.site_title}
                onChange={(e) => setConfig({ ...config, site_title: e.target.value })}
                className="bg-white/5 border-white/10 rounded-xl h-12 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo" className="text-xs font-black uppercase tracking-widest text-white/60">URL del Logo (PNG/SVG)</Label>
              <div className="flex gap-2">
                <Input
                  id="logo"
                  placeholder="https://..."
                  value={config.site_logo}
                  onChange={(e) => setConfig({ ...config, site_logo: e.target.value })}
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white flex-1"
                />
                <div className="relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload('site_logo')} accept="image/*" />
                  <Button variant="outline" className="h-12 w-12 rounded-xl bg-white/5 border-white/10 text-white p-0">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon" className="text-xs font-black uppercase tracking-widest text-white/60">URL del Favicon (.ico/png)</Label>
              <div className="flex gap-2">
                <Input
                  id="favicon"
                  placeholder="https://..."
                  value={config.site_favicon}
                  onChange={(e) => setConfig({ ...config, site_favicon: e.target.value })}
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white flex-1"
                />
                <div className="relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload('site_favicon')} accept="image/*,.ico" />
                  <Button variant="outline" className="h-12 w-12 rounded-xl bg-white/5 border-white/10 text-white p-0">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden">
        <CardHeader className="bg-white/[0.02] border-b border-white/5 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Search className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">SEO y Seguimiento</CardTitle>
          </div>
          <CardDescription className="text-white/40 text-sm">
            Configura las herramientas de análisis y verificación de buscadores.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="gsc" className="text-xs font-black uppercase tracking-widest text-white/60">
                Google Search Console (Código de Verificación)
              </Label>
              <Input
                id="gsc"
                placeholder="ej: google-site-verification=XXXXX..."
                value={config.google_search_console}
                onChange={(e) => setConfig({ ...config, google_search_console: e.target.value })}
                className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-primary/50 focus:ring-primary/20 transition-all"
              />
              <p className="text-[10px] text-white/20 italic">
                Pega aquí el código de verificación que te proporciona Google para indexar tu web.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-primary text-black font-black uppercase text-xs tracking-widest px-8 h-12 rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
