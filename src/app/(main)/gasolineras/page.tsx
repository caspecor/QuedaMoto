import GasolinerasClient from './GasolinerasClient'

export const metadata = {
  title: 'Gasolineras Canarias – QuedaMoto',
  description: 'Precios actualizados diariamente de las gasolineras más económicas de las Islas Canarias. Filtra por isla, tipo de combustible y rango de precio.',
}

export default function GasolinerasPage() {
  return <GasolinerasClient />
}
