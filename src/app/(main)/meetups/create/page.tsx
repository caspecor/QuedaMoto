import { CreateMeetupForm } from "@/components/meetups/CreateMeetupForm"

export const metadata = {
  title: "Organizar Ruta - QuedaMoto",
}

export default function CreateMeetupPage() {
  return (
    <div className="container px-4 pt-32 pb-12 max-w-2xl mx-auto space-y-6">
      <div className="animate-reveal">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">Crear Quedada</h1>
        <p className="text-white/50 mt-2 font-medium">Organiza una ruta, un desayuno o un paseo nocturno.</p>
      </div>
      <CreateMeetupForm />
    </div>
  )
}
