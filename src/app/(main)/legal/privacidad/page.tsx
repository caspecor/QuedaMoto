import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Tratamiento de Datos y Privacidad en QuedaMoto',
}

export default function PrivacidadPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 md:py-32 prose prose-invert prose-primary">
      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 text-primary">POLÍTICA DE PRIVACIDAD</h1>
      
      <p className="lead text-xl text-white/70">
        En QuedaMoto estamos profundamente comprometidos con el cumplimiento de la normativa española y europea de protección de datos personales. Esta Política de Privacidad explica cómo recogemos, protegemos, utilizamos y compartimos tu información personal.
      </p>

      <h2>1. INFORMACIÓN BÁSICA SOBRE PROTECCIÓN DE DATOS</h2>
      <ul>
        <li><strong>Responsable:</strong> QuedaMoto.</li>
        <li><strong>Encargado Técnico:</strong> WoofCanarias.es (Mantenimiento de bases de datos e infraestructura).</li>
        <li><strong>Finalidad principal:</strong> Gestión de usuarios registrados, creación de rutas moteras, foros, notificaciones e interacción comunitaria.</li>
        <li><strong>Legitimación:</strong> Consentimiento expreso del interesado y ejecución de condiciones de uso.</li>
        <li><strong>Destinatarios:</strong> No se cederán datos a terceros, salvo obligación legal o proveedores tecnológicos estrictamente necesarios para el funcionamiento (ej. proveedores de hosting y mensajería).</li>
        <li><strong>Derechos:</strong> Acceder, rectificar, suprimir los datos, así como otros derechos detallados más abajo.</li>
      </ul>

      <h2>2. ¿QUÉ DATOS RECOPILAMOS?</h2>
      <p>
        Para que puedas formar parte de QuedaMoto y organizar o unirte a rutas, recopilamos diferentes tipos de información:
      </p>
      <ul>
        <li><strong>Datos identificativos:</strong> Nombre, apellidos o alias, nombre de usuario y correo electrónico.</li>
        <li><strong>Datos de perfil:</strong> Biografía, modelo de moto, experiencia de conducción e imagen de avatar.</li>
        <li><strong>Datos de geolocalización:</strong> Para permitir la función de mapeo de rutas y encontrar moteros cercanos, podemos procesar ubicaciones (latitud y longitud). Estos datos se anonimizan siempre que es posible y solo se muestran en relación a las quedadas que organices o participes.</li>
        <li><strong>Datos de conexión:</strong> Direcciones IP, navegador, y metadatos de uso para análisis de seguridad y prevención de bots.</li>
      </ul>

      <h2>3. ¿PARA QUÉ UTILIZAMOS TUS DATOS?</h2>
      <p>
        En QuedaMoto tratamos la información que nos facilitan las personas interesadas con los siguientes fines:
      </p>
      <ul>
        <li><strong>Prestación del servicio:</strong> Permitir el login seguro, la creación de rutas, la inscripción en quedadas de otros usuarios y la comunicación a través del sistema de chat integrado.</li>
        <li><strong>Notificaciones:</strong> Avisar sobre cambios en rutas a las que estás inscrito, invitaciones o novedades de la plataforma (puedes ajustar estas preferencias en tu perfil).</li>
        <li><strong>Mantenimiento y seguridad:</strong> Detección de cuentas falsas, comportamientos abusivos y mantenimiento técnico del servidor por parte del equipo de <strong>WoofCanarias.es</strong>.</li>
      </ul>

      <h2>4. BASE DE LEGITIMACIÓN</h2>
      <p>
        La base legal para el tratamiento de sus datos es la ejecución de los servicios de la plataforma según los Términos de Uso (Aviso Legal) aceptados al registrarse. Además, el consentimiento expreso prestado al facilitar voluntariamente los datos del perfil (como el modelo de moto o la foto).
      </p>

      <h2>5. TIEMPO DE CONSERVACIÓN</h2>
      <p>
        Los datos personales proporcionados se conservarán mientras no solicite su supresión. Si decides dar de baja tu cuenta, eliminaremos o anonimizaremos tus datos personales en un plazo máximo de 30 días, conservando bloqueada únicamente aquella información necesaria para cumplir con obligaciones legales durante el periodo de prescripción de responsabilidades (generalmente 5 años).
      </p>

      <h2>6. COMUNICACIÓN DE DATOS A TERCEROS</h2>
      <p>
        QuedaMoto no vende, alquila ni cede tus datos personales a terceras empresas con fines comerciales. Tus datos solo podrán ser comunicados a:
      </p>
      <ul>
        <li>Fuerzas y Cuerpos de Seguridad del Estado o autoridades judiciales, cuando así lo exija la ley.</li>
        <li><strong>WoofCanarias.es</strong>: Actuando como Encargado del Tratamiento en materia técnica para proveer la infraestructura, servidores y mantenimiento de bases de datos, con los cuales tenemos firmados contratos de confidencialidad estrictos bajo la normativa europea.</li>
        <li>Proveedores de infraestructura Cloud (como Vercel, Supabase o AWS) donde se aloja el servicio, ubicados en la Unión Europea o bajo el marco de privacidad Data Privacy Framework.</li>
      </ul>

      <h2>7. TUS DERECHOS (DERECHOS ARCO)</h2>
      <p>
        Como titular de los datos, puedes ejercer en cualquier momento tus derechos de:
      </p>
      <ul>
        <li><strong>Acceso:</strong> Saber si estamos tratando tus datos y cuáles.</li>
        <li><strong>Rectificación:</strong> Modificar los datos incompletos o inexactos (muchos de los cuales puedes modificar tú mismo desde <code>/profile</code>).</li>
        <li><strong>Supresión ("Derecho al olvido"):</strong> Solicitar la eliminación de tus datos cuando ya no sean necesarios para los fines por los que fueron recogidos.</li>
        <li><strong>Oposición y Limitación:</strong> Solicitar que dejemos de procesar tus datos para fines concretos.</li>
        <li><strong>Portabilidad:</strong> Obtener una copia de tus datos en un formato estructurado.</li>
      </ul>
      <p>
        Para ejercer estos derechos, envíanos un correo a <a href="mailto:admin@quedamoto.com" className="text-primary">admin@quedamoto.com</a> acompañando una prueba de identidad válida en derecho, como copia del DNI o documento equivalente.
      </p>

      <div className="mt-16 pt-8 border-t border-white/10 text-sm text-white/40">
        <p>Documento actualizado a fecha de Mayo 2026.</p>
        <p>Protección y Seguridad de Datos implementada por <a href="https://woofcanarias.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WoofCanarias.es</a></p>
      </div>
    </div>
  )
}
