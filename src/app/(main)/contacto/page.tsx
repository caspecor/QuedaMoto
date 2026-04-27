'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { submitContactMessage } from "./actions"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await submitContactMessage(form)
      if (res.error) {
        toast.error(res.error)
      } else {
        setSuccess(true)
        toast.success("Mensaje enviado correctamente")
      }
    } catch (err) {
      toast.error("Hubo un error al enviar el mensaje")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
        <div className="glass-card p-12 rounded-[3rem] text-center max-w-lg space-y-6 animate-reveal">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white italic">¡MENSAJE ENVIADO!</h2>
          <p className="text-white/50 font-medium">Hemos recibido tu consulta y nuestro equipo se pondrá en contacto contigo lo antes posible.</p>
          <Button onClick={() => setSuccess(false)} variant="outline" className="mt-8 rounded-xl border-white/10 text-white hover:bg-white/5">
            Enviar otro mensaje
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh pb-20">
      <div className="container px-4 pt-32 pb-12 max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4 animate-reveal">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">
            CONTACTA CON <span className="text-primary">NOSOTROS</span>
          </h1>
          <p className="text-lg text-white/50 font-medium">
            ¿Tienes dudas, sugerencias o has encontrado algún problema? Cuéntanoslo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 rounded-[2.5rem] space-y-8 animate-reveal [animation-delay:0.2s]">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-white/40">Nombre</Label>
              <Input 
                id="name" 
                required 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="bg-white/5 border-white/10 text-white rounded-xl h-12" 
                placeholder="Tu nombre" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/40">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="bg-white/5 border-white/10 text-white rounded-xl h-12" 
                placeholder="correo@ejemplo.com" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-white/40">Asunto</Label>
            <Select required value={form.subject} onValueChange={(val: string | null) => setForm({...form, subject: val || ''})}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white rounded-xl h-12">
                <SelectValue placeholder="Selecciona el motivo de tu consulta" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f0f] border-white/10 text-white rounded-xl">
                <SelectItem value="soporte">Soporte técnico / Problemas con la cuenta</SelectItem>
                <SelectItem value="duda">Duda general sobre rutas</SelectItem>
                <SelectItem value="sugerencia">Sugerencia de mejora</SelectItem>
                <SelectItem value="reporte">Reportar a un usuario/ruta</SelectItem>
                <SelectItem value="otro">Otro motivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-white/40">Mensaje</Label>
            <Textarea 
              id="message" 
              required 
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              className="bg-white/5 border-white/10 text-white rounded-xl min-h-[150px] resize-none" 
              placeholder="Explícanos con detalle..." 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 text-black uppercase tracking-wider">
            {loading ? "Enviando..." : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Mensaje
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
