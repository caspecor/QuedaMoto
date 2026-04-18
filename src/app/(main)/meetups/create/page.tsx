import { CreateMeetupForm } from "@/components/meetups/CreateMeetupForm"

export const metadata = {
  title: "Organizar Ruta - QuedaMoto",
}

export default function CreateMeetupPage() {
  return (
    <div className="container px-4 py-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-sans text-foreground">Crear Quedada</h1>
        <p className="text-muted-foreground mt-1">Organiza una ruta, un desayuno o un paseo nocturno.</p>
      </div>
      <CreateMeetupForm />
    </div>
  )
}
