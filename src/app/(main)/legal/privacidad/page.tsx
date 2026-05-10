import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Tratamiento de Datos y Privacidad en QuedaMoto',
}

export default function PrivacidadPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-32 prose prose-invert">
      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 text-primary">POLÍTICA DE PRIVACIDAD</h1>
      
      <p className="lead text-xl text-white/70">
        En QuedaMoto nos tomamos muy en serio la protección de tus datos personales, cumpliendo con el Reglamento General de Protección de Datos (RGPD) y la LOPDGDD española.
      </p>

      <h2>1. Responsable del Tratamiento</h2>
      <p>
        El responsable del tratamiento de los datos recogidos en esta web es QuedaMoto. La plataforma técnica ha sido desarrollada y es mantenida por <strong>WoofCanarias.es</strong>, quien actúa como encargado del tratamiento a nivel técnico.
      </p>

      <h2>2. Finalidad del Tratamiento</h2>
      <p>
        Los datos personales recogidos se tratarán con las siguientes finalidades:
      </p>
      <ul>
        <li>Gestionar el registro de usuarios y la creación de perfiles.</li>
        <li>Permitir la creación, organización y participación en rutas moteras (quedadas).</li>
        <li>Enviar notificaciones relevantes sobre el estado de las quedadas.</li>
        <li>Resolver consultas a través del formulario de contacto.</li>
      </ul>

      <h2>3. Legitimación</h2>
      <p>
        La base legal para el tratamiento de sus datos es el consentimiento expreso del usuario al registrarse en la plataforma, así como la ejecución del servicio solicitado (participar en la comunidad).
      </p>

      <h2>4. Conservación de Datos</h2>
      <p>
        Los datos proporcionados se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales.
      </p>

      <h2>5. Derechos del Usuario</h2>
      <p>
        El usuario tiene derecho a acceder a sus datos personales, rectificar los datos inexactos o solicitar su supresión cuando los datos ya no sean necesarios, dirigiendo su petición a admin@quedamoto.com.
      </p>

      <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/40">
        Última actualización: Mayo 2026. Plataforma desarrollada por <a href="https://woofcanarias.es" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary">WoofCanarias.es</a>
      </div>
    </div>
  )
}
