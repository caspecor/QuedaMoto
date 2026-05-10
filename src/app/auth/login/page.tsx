import { AuthDualPanel } from "@/components/auth/AuthDualPanel";

export const metadata = {
  title: "Acceder - QuedaMoto",
  description: "Inicia sesión o regístrate en QuedaMoto",
};

export default function LoginPage() {
  return <AuthDualPanel />;
}
