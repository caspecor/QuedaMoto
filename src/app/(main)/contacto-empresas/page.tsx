import { Zap, Mail, Phone, MapPin, Building2 } from "lucide-react"

export const metadata = {
  title: "Publicidad & Empresas - QuedaMoto",
}

export default function ContactoEmpresasPage() {
  return (
    <div className="container px-4 pt-32 pb-24 max-w-4xl mx-auto space-y-16 animate-reveal">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-4">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Sponsors & Empresas</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
          CONECTA CON LA <br/> MAYOR COMUNIDAD
        </h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
          Haz que tu marca ruéde con nosotros. Ocupa un espacio publicitario premium y llega a miles de moteros en todo el país.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-card shadow-2xl border border-white/5 rounded-[2.5rem] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Solicitar Presupuesto</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Nombre de la Empresa</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Ej. Neumáticos Paco"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Email Corporativo</label>
              <input 
                type="email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="contacto@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Mensaje / Propuesta</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors min-h-[150px]"
                placeholder="Estamos interesados en el Hueco 2 de la Portada..."
              />
            </div>
            <button type="button" className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-primary/90 transition-colors mt-4">
              Enviar Solicitud
            </button>
          </form>
        </div>

        <div className="space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-black italic text-white">¿Por qué anunciarse?</h3>
            <p className="text-white/40 leading-relaxed">
              Al anunciar tu negocio en QuedaMoto consigues visibilidad directa ante miles de motoristas activos en tu zona y en todo el país.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-white">Impacto Directo</p>
                <p className="text-sm text-white/40">Tu anuncio se muestra sin algoritmos que lo oculten.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 shrink-0 border border-white/10">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-white">sponsors@quedamoto.com</p>
                <p className="text-sm text-white/40">Escríbenos directamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
