import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso Legal y Condiciones de Uso de QuedaMoto',
}

export default function AvisoLegalPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-32 prose prose-invert">
      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 text-primary">AVISO LEGAL</h1>
      
      <p className="lead text-xl text-white/70">
        El presente documento tiene como finalidad establecer y regular las normas de uso de la web QuedaMoto.
      </p>

      <h2>1. Datos Identificativos</h2>
      <p>
        En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), los datos aquí consignados corresponden a la entidad titular del sitio web.
      </p>
      <ul>
        <li><strong>Denominación Social:</strong> QuedaMoto (pendiente de aportar datos fiscales)</li>
        <li><strong>Email de contacto:</strong> admin@quedamoto.com</li>
        <li><strong>Desarrollado por:</strong> <a href="https://woofcanarias.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WoofCanarias.es</a></li>
      </ul>

      <h2>2. Usuarios</h2>
      <p>
        El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
      </p>

      <h2>3. Uso del Portal</h2>
      <p>
        QuedaMoto proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet. El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.
      </p>

      <h2>4. Propiedad Intelectual e Industrial</h2>
      <p>
        QuedaMoto por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma. Todos los derechos reservados.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/40">
        Última actualización: Mayo 2026. Plataforma desarrollada por WoofCanarias.es
      </div>
    </div>
  )
}
