import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Tratamiento de Datos y Privacidad en QuedaMoto',
}

export default function PrivacidadPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 md:py-32">
      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-12 text-primary uppercase">
        Política de Privacidad
      </h1>
      
      <div className="flex flex-col gap-6 text-lg text-white/70 leading-relaxed">
        <p className="text-xl font-medium text-white">
          En QuedaMoto estamos profundamente comprometidos con el cumplimiento de la normativa española y europea de protección de datos personales. Esta Política de Privacidad explica cómo recogemos, protegemos, utilizamos y compartimos tu información personal.
        </p>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          1. Información Básica
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong className="text-white">Responsable:</strong> QuedaMoto.</li>
          <li><strong className="text-white">Encargado Técnico:</strong> WoofCanarias.es (Mantenimiento de bases de datos e infraestructura).</li>
          <li><strong className="text-white">Finalidad principal:</strong> Gestión de usuarios registrados, creación de rutas moteras, foros, notificaciones e interacción comunitaria.</li>
          <li><strong className="text-white">Legitimación:</strong> Consentimiento expreso del interesado y ejecución de condiciones de uso.</li>
          <li><strong className="text-white">Destinatarios:</strong> No se cederán datos a terceros, salvo obligación legal o proveedores tecnológicos estrictamente necesarios para el funcionamiento (ej. proveedores de hosting y mensajería).</li>
          <li><strong className="text-white">Derechos:</strong> Acceder, rectificar, suprimir los datos, así como otros derechos detallados más abajo.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          2. ¿Qué Datos Recopilamos?
        </h2>
        <p>
          Para que puedas formar parte de QuedaMoto y organizar o unirte a rutas, recopilamos diferentes tipos de información:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong className="text-white">Datos identificativos:</strong> Nombre, apellidos o alias, nombre de usuario y correo electrónico.</li>
          <li><strong className="text-white">Datos de perfil:</strong> Biografía, modelo de moto, experiencia de conducción e imagen de avatar.</li>
          <li><strong className="text-white">Datos de geolocalización:</strong> Para permitir la función de mapeo de rutas y encontrar moteros cercanos, podemos procesar ubicaciones (latitud y longitud). Estos datos se anonimizan siempre que es posible y solo se muestran en relación a las quedadas que organices o participes.</li>
          <li><strong className="text-white">Datos de conexión:</strong> Direcciones IP, navegador, y metadatos de uso para análisis de seguridad y prevención de bots.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          3. ¿Para qué Utilizamos tus Datos?
        </h2>
        <p>
          En QuedaMoto tratamos la información que nos facilitan las personas interesadas con los siguientes fines:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong className="text-white">Prestación del servicio:</strong> Permitir el login seguro, la creación de rutas, la inscripción en quedadas de otros usuarios y la comunicación a través del sistema de chat integrado.</li>
          <li><strong className="text-white">Notificaciones:</strong> Avisar sobre cambios en rutas a las que estás inscrito, invitaciones o novedades de la plataforma (puedes ajustar estas preferencias en tu perfil).</li>
          <li><strong className="text-white">Mantenimiento y seguridad:</strong> Detección de cuentas falsas, comportamientos abusivos y mantenimiento técnico del servidor por parte del equipo de <strong>WoofCanarias.es</strong>.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          4. Base de Legitimación
        </h2>
        <p>
          La base legal para el tratamiento de sus datos es la ejecución de los servicios de la plataforma según los Términos de Uso (Aviso Legal) aceptados al registrarse. Además, el consentimiento expreso prestado al facilitar voluntariamente los datos del perfil (como el modelo de moto o la foto).
        </p>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          5. Tiempo de Conservación
        </h2>
        <p>
          Los datos personales proporcionados se conservarán mientras no solicite su supresión. Si decides dar de baja tu cuenta, eliminaremos o anonimizaremos tus datos personales en un plazo máximo de 30 días, conservando bloqueada únicamente aquella información necesaria para cumplir con obligaciones legales durante el periodo de prescripción de responsabilidades (generalmente 5 años).
        </p>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          6. Comunicación a Terceros
        </h2>
        <p>
          QuedaMoto no vende, alquila ni cede tus datos personales a terceras empresas con fines comerciales. Tus datos solo podrán ser comunicados a:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>Fuerzas y Cuerpos de Seguridad del Estado o autoridades judiciales, cuando así lo exija la ley.</li>
          <li><strong className="text-white">WoofCanarias.es</strong>: Actuando como Encargado del Tratamiento en materia técnica para proveer la infraestructura, servidores y mantenimiento de bases de datos, con los cuales tenemos firmados contratos de confidencialidad estrictos bajo la normativa europea.</li>
          <li>Proveedores de infraestructura Cloud (como Vercel, Supabase o AWS) donde se aloja el servicio, ubicados en la Unión Europea o bajo el marco de privacidad Data Privacy Framework.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          7. Tus Derechos (ARCO)
        </h2>
        <p>
          Como titular de los datos, puedes ejercer en cualquier momento tus derechos de:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong className="text-white">Acceso:</strong> Saber si estamos tratando tus datos y cuáles.</li>
          <li><strong className="text-white">Rectificación:</strong> Modificar los datos incompletos o inexactos (muchos de los cuales puedes modificar tú mismo desde tu perfil).</li>
          <li><strong className="text-white">Supresión ("Derecho al olvido"):</strong> Solicitar la eliminación de tus datos cuando ya no sean necesarios para los fines por los que fueron recogidos.</li>
          <li><strong className="text-white">Oposición y Limitación:</strong> Solicitar que dejemos de procesar tus datos para fines concretos.</li>
          <li><strong className="text-white">Portabilidad:</strong> Obtener una copia de tus datos en un formato estructurado.</li>
        </ul>
        <p>
          Para ejercer estos derechos, envíanos un correo a <a href="mailto:admin@quedamoto.com" className="text-primary font-bold hover:underline">admin@quedamoto.com</a> acompañando una prueba de identidad válida en derecho, como copia del DNI o documento equivalente.
        </p>

        <div className="mt-16 pt-8 border-t border-white/10 text-sm text-white/40 flex flex-col gap-2">
          <p>Documento actualizado a fecha de Mayo 2026.</p>
          <p>Protección y Seguridad de Datos implementada por <a href="https://woofcanarias.es" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">WoofCanarias.es</a></p>
        </div>
      </div>
    </div>
  )
}
