'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "¿Qué es QuedaMoto?",
      answer: "QuedaMoto es una plataforma creada por y para moteros. Nuestro objetivo es conectar a apasionados de las dos ruedas para organizar rutas, conocer nuevos compañeros de viaje y dejar de rodar en solitario."
    },
    {
      question: "¿Es gratis usar la plataforma?",
      answer: "Sí. Registrarse, unirse a rutas y organizar tus propias quedadas es totalmente gratuito. QuedaMoto es un proyecto impulsado por la comunidad."
    },
    {
      question: "¿Cómo funciona el sistema de Niveles y XP?",
      answer: "Por cada acción que realizas en la plataforma, ganas Puntos de Experiencia (XP). Crear una quedada te da +50 XP, unirte a una ruta +25 XP, y participar en el chat +5 XP. A medida que acumulas XP, subirás de nivel: desde Novato hasta Mito del Asfalto."
    },
    {
      question: "¿Por qué no puedo eliminar una ruta que ya ha pasado?",
      answer: "Una vez que la fecha de una ruta expira, esta se bloquea y pasa a formar parte del historial de la comunidad. Esto nos permite mantener un registro de las actividades y sirve como referencia para futuros eventos."
    },
    {
      question: "¿Es visible mi número de teléfono para otros usuarios?",
      answer: "No. Tu número de teléfono es estrictamente confidencial y solo es accesible para la administración de QuedaMoto por motivos de seguridad."
    },
    {
      question: "¿Puedo apuntarme a cualquier ruta?",
      answer: "Sí, siempre y cuando cumplas con los requisitos de la ruta (por ejemplo, el nivel de conducción requerido) y haya plazas disponibles."
    }
  ]

  return (
    <div className="min-h-screen bg-mesh pb-20">
      <div className="container px-4 pt-32 pb-12 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4 animate-reveal">
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">
            PREGUNTAS <span className="text-primary">FRECUENTES</span>
          </h1>
          <p className="text-lg text-white/50 font-medium max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre QuedaMoto.
          </p>
        </div>

        <div className="space-y-4 animate-reveal [animation-delay:0.2s]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div 
                key={i} 
                className={`glass-card rounded-3xl transition-all duration-300 border border-white/5 overflow-hidden ${isOpen ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'}`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none"
                >
                  <h3 className={`text-xl font-bold transition-colors ${isOpen ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                    {faq.question}
                  </h3>
                  <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <p className="px-6 pb-6 text-white/60 leading-relaxed font-medium text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
