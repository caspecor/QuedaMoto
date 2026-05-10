import { redirect } from 'next/navigation'

export default function RegisterPage() {
  // El registro ahora está unificado con el login en el mismo componente dual
  redirect('/auth/login')
}
