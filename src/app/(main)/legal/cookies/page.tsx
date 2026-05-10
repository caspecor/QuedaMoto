import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de Cookies de QuedaMoto',
}

export default function CookiesPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-32 prose prose-invert">
      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 text-primary">POLÍTICA DE COOKIES</h1>
      
      <p className="lead text-xl text-white/70">
        En QuedaMoto utilizamos cookies y tecnologías similares para mejorar la experiencia de usuario y garantizar el correcto funcionamiento de la plataforma.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en su ordenador o dispositivo móvil cuando los visita. Permiten recordar sus acciones y preferencias (como el inicio de sesión, idioma, etc.) durante un período de tiempo, para que no tenga que volver a configurarlos cuando regrese al sitio o navegue por sus páginas.
      </p>

      <h2>2. ¿Qué cookies utilizamos?</h2>
      <ul>
        <li><strong>Cookies técnicas y estrictamente necesarias:</strong> Aquellas que permiten la navegación a través de la web y la utilización de opciones o servicios como la sesión de usuario (ej. NextAuth.js).</li>
        <li><strong>Cookies de personalización:</strong> Permiten recordar información para que el usuario acceda al servicio con ciertas características (ej. preferencias de mapa).</li>
        <li><strong>Cookies de análisis:</strong> Tratadas por nosotros o por terceros (ej. Google Analytics), nos permiten cuantificar el número de usuarios y realizar mediciones estadísticas del uso.</li>
      </ul>

      <h2>3. Gestión de las cookies</h2>
      <p>
        Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador. Al desactivar las cookies, es posible que algunos de los servicios disponibles dejen de estar operativos.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/40">
        Última actualización: Mayo 2026. Plataforma desarrollada por <a href="https://woofcanarias.es" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary">WoofCanarias.es</a>
      </div>
    </div>
  )
}
