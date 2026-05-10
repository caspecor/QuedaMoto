import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de Cookies de QuedaMoto',
}

export default function CookiesPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 md:py-32 prose prose-invert prose-primary">
      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 text-primary">POLÍTICA DE COOKIES</h1>
      
      <p className="lead text-xl text-white/70">
        En cumplimiento con el artículo 22.2 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), así como las normativas europeas, te informamos sobre el uso de cookies y tecnologías similares en QuedaMoto.
      </p>

      <h2>1. ¿QUÉ SON LAS COOKIES Y POR QUÉ LAS USAMOS?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en su ordenador, teléfono inteligente o tableta cuando los visita. Su función principal es que el sitio web funcione de manera más fluida y eficiente, así como proporcionar información sobre los hábitos de navegación del usuario o de su equipo.
      </p>
      <p>
        En QuedaMoto no usamos cookies abusivas ni intrusivas. Las utilizamos exclusivamente para mantener tu sesión activa, recordar tus preferencias (como el modo oscuro o la ubicación en el mapa de rutas) y analizar el rendimiento básico de la web.
      </p>

      <h2>2. TIPOS DE COOKIES QUE UTILIZAMOS EN QUEDAMOTO</h2>
      <p>
        Dependiendo de su finalidad y de la entidad que las gestione, la plataforma desarrollada por <strong>WoofCanarias.es</strong> emplea las siguientes categorías de cookies:
      </p>
      
      <h3>2.1. Cookies Técnicas y Estrictamente Necesarias</h3>
      <p>
        Son aquellas imprescindibles para el correcto funcionamiento de la plataforma. Sin ellas, no podrías iniciar sesión en tu cuenta ni apuntarte a rutas.
      </p>
      <ul>
        <li><strong>Autenticación (NextAuth):</strong> Cookies de sesión encriptadas que nos permiten saber que has hecho login de forma segura y evitar accesos no autorizados a tu perfil.</li>
        <li><strong>Seguridad (CSRF):</strong> Previenen ataques maliciosos de falsificación de peticiones entre sitios web.</li>
      </ul>

      <h3>2.2. Cookies de Personalización</h3>
      <p>
        Son aquellas que permiten recordar información para que el usuario acceda al servicio con determinadas características que pueden diferenciar su experiencia de la de otros usuarios.
      </p>
      <ul>
        <li><strong>Preferencias UI:</strong> Recuerdan preferencias visuales menores y el estado de cierres de paneles (por ejemplo, si has cerrado el banner de avisos).</li>
      </ul>

      <h3>2.3. Cookies Analíticas (Terceros)</h3>
      <p>
        Nos permiten cuantificar el número de usuarios y realizar mediciones estadísticas del uso de la plataforma. Para ello, utilizamos herramientas de código abierto o integraciones respetuosas con la privacidad que analizan de forma <strong>anónima</strong> las visitas a nuestras rutas y secciones.
      </p>

      <h2>3. COOKIES DE MAPAS Y SERVICIOS EXTERNOS</h2>
      <p>
        Dado que QuedaMoto depende intensamente de la geolocalización de rutas y mapas interactivos (como Mapbox o Leaflet), estos proveedores pueden instalar cookies propias o acceder a datos técnicos temporales (IP) para servir los fragmentos (tiles) del mapa. El uso del mapa implica la aceptación técnica de estos flujos de datos.
      </p>

      <h2>4. ¿CÓMO DESACTIVAR O ELIMINAR LAS COOKIES?</h2>
      <p>
        Tienes derecho a elegir qué cookies permites en tu navegador. Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo en cualquier momento mediante la configuración de las opciones del navegador que utilices:
      </p>
      <ul>
        <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
        <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad & Seguridad &gt; Cookies y datos del sitio.</li>
        <li><strong>Safari:</strong> Preferencias &gt; Privacidad.</li>
        <li><strong>Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio.</li>
      </ul>
      <p>
        <em>Atención:</em> Si decides desactivar las cookies técnicas/estrictamente necesarias, no podrás iniciar sesión ni organizar rutas en QuedaMoto, ya que el sistema no podrá identificarte.
      </p>

      <h2>5. MODIFICACIONES DE LA POLÍTICA</h2>
      <p>
        QuedaMoto puede modificar esta Política de Cookies en función de nuevas exigencias legislativas, reglamentarias, o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de Protección de Datos (AEPD).
      </p>

      <div className="mt-16 pt-8 border-t border-white/10 text-sm text-white/40">
        <p>Documento actualizado a fecha de Mayo 2026.</p>
        <p>Infraestructura tecnológica de <a href="https://woofcanarias.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WoofCanarias.es</a></p>
      </div>
    </div>
  )
}
