import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso Legal y Condiciones de Uso de QuedaMoto',
}

export default function AvisoLegalPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 md:py-32">
      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-12 text-primary uppercase">
        Aviso Legal
      </h1>
      
      <div className="flex flex-col gap-6 text-lg text-white/70 leading-relaxed">
        <p className="text-xl font-medium text-white">
          El presente aviso legal regula el uso del sitio web y de la aplicación móvil de QuedaMoto, así como las responsabilidades derivadas de su utilización.
        </p>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          1. Datos Identificativos
        </h2>
        <p>
          En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), le informamos que el titular de esta plataforma es QuedaMoto, una comunidad independiente de entusiastas del motor.
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong className="text-white">Titularidad:</strong> QuedaMoto</li>
          <li><strong className="text-white">Contacto electrónico:</strong> <a href="mailto:admin@quedamoto.com" className="text-primary hover:underline font-bold">admin@quedamoto.com</a></li>
          <li><strong className="text-white">Desarrollo Técnico y Mantenimiento:</strong> Este portal web ha sido íntegramente desarrollado y es mantenido tecnológicamente por la agencia <a href="https://woofcanarias.es" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">WoofCanarias.es</a>, con sede en Canarias, España.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          2. Usuarios y Aceptación
        </h2>
        <p>
          El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. QuedaMoto proporciona el acceso a multitud de informaciones, servicios, herramientas, programas o datos en Internet pertenecientes a la plataforma o a sus licenciantes a los que el USUARIO pueda tener acceso.
        </p>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          3. Condiciones de Uso del Portal
        </h2>
        <p>
          El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos. En dicho registro el USUARIO será responsable de aportar información veraz y lícita. Como consecuencia de este registro, al USUARIO se le puede proporcionar una contraseña de la que será responsable, comprometiéndose a hacer un uso diligente y confidencial de la misma.
        </p>
        <p>
          El USUARIO se compromete a hacer un uso adecuado de los contenidos y servicios que QuedaMoto ofrece a través de su portal y con carácter enunciativo pero no limitativo, a no emplearlos para:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>Incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público.</li>
          <li>Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos.</li>
          <li>Provocar daños en los sistemas físicos y lógicos de QuedaMoto, de sus proveedores o de terceras personas, introducir o difundir en la red virus informáticos o cualesquiera otros sistemas que sean susceptibles de provocar los daños anteriormente mencionados.</li>
          <li>Intentar acceder y, en su caso, utilizar las cuentas de correo electrónico de otros usuarios y modificar o manipular sus mensajes o rutas.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          4. Responsabilidad en Rutas y Eventos
        </h2>
        <p>
          QuedaMoto actúa <strong className="text-white">exclusivamente como una plataforma tecnológica de intermediación y contacto</strong> entre usuarios interesados en el mundo del motociclismo. QuedaMoto <strong className="text-primary">NO organiza, NO patrocina, y NO se hace responsable</strong> directa ni subsidiariamente de ninguna de las rutas, quedadas o eventos (en adelante "Meetups") creados por los usuarios en la plataforma.
        </p>
        <p>
          Cualquier accidente, incidencia de tráfico, infracción normativa, daño a terceros o alteraciones del orden público que pudieran ocurrir durante o como consecuencia de un Meetup organizado a través de QuedaMoto, será de la <strong className="text-white">exclusiva responsabilidad de los individuos involucrados y de los creadores de dicha ruta</strong>. Recomendamos encarecidamente a todos los usuarios que cuenten con su seguro en regla, cumplan estrictamente las normativas de la DGT (Dirección General de Tráfico) y conduzcan con la máxima precaución y respeto.
        </p>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          5. Propiedad Intelectual e Industrial
        </h2>
        <p>
          QuedaMoto por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.).
        </p>
        <p>
          El diseño del código, la infraestructura y el diseño visual de la aplicación han sido elaborados por <strong className="text-white">WoofCanarias.es</strong>, manteniendo este los derechos morales como autor de la obra de software.
        </p>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          6. Exclusión de Garantías
        </h2>
        <p>
          QuedaMoto y su equipo de desarrollo (WoofCanarias.es) no se hacen responsables, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
        </p>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          7. Modificaciones
        </h2>
        <p>
          QuedaMoto se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados.
        </p>

        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mt-8 mb-2 uppercase">
          8. Legislación Aplicable
        </h2>
        <p>
          La relación entre QuedaMoto y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de España, salvo que la ley aplicable disponga otra cosa.
        </p>

        <div className="mt-16 pt-8 border-t border-white/10 text-sm text-white/40 flex flex-col gap-2">
          <p>Documento actualizado a fecha de Mayo 2026.</p>
          <p>Desarrollado y optimizado por <a href="https://woofcanarias.es" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">WoofCanarias.es</a></p>
        </div>
      </div>
    </div>
  )
}
