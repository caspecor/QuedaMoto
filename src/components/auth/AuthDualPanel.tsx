'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { signupAction } from '@/app/auth/actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import styles from './auth.module.css'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const registerSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Mínimo 9 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

export function AuthDualPanel() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const router = useRouter()

  const { 
    register: loginRegister, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const { 
    register: signupRegister, 
    handleSubmit: handleSignupSubmit, 
    formState: { errors: registerErrors } 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onLoginSubmit(data: LoginFormValues) {
    setIsLoginLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        if (result.error.includes('RATE_LIMIT') || result.status === 429) {
          toast.error('Demasiados intentos. Por favor, espera 15 minutos.')
        } else {
          toast.error('Credenciales inválidas')
        }
      } else if (result?.ok) {
        toast.success('¡Bienvenido de nuevo!')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 300)
      }
    } catch (error: any) {
      if (error?.message?.includes('429')) {
        toast.error('Demasiados intentos. Por favor, espera 15 minutos.')
      } else {
        toast.error('Ocurrió un error al iniciar sesión')
      }
    } finally {
      setIsLoginLoading(false)
    }
  }

  async function onRegisterSubmit(data: RegisterFormValues) {
    setIsRegisterLoading(true)
    try {
      const response = await signupAction(data)
      if (response?.error) {
        toast.error(response.error)
      } else {
        const loginResult = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        })
        
        if (loginResult?.error) {
          toast.error('Registrado, pero hubo un error al entrar. Por favor, inicia sesión.')
          setIsRightPanelActive(false) // switch to login panel
        } else {
          toast.success('Cuenta creada exitosamente')
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 300)
        }
      }
    } catch (error: any) {
      console.error(error)
      if (error?.message?.includes('429') || error?.status === 429) {
        toast.error('Demasiados intentos. Por favor, espera unos minutos.')
      } else {
        toast.error(error?.message ? `Error NextJS: ${error.message}` : 'Error de comunicación con el servidor')
      }
    } finally {
      setIsRegisterLoading(false)
    }
  }

  return (
    <div className={styles.authWrapper}>
      <div className={`${styles.container} ${isRightPanelActive ? styles.rightPanelActive : ''}`} id="container">
        
        {/* Sign Up Container */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.authForm} onSubmit={handleSignupSubmit(onRegisterSubmit)}>
            <h1>Crea tu Cuenta</h1>
            <span>y empieza a rodar con nosotros</span>
            
            <input className={styles.authInput} type="text" placeholder="Nombre de usuario" {...signupRegister('username')} />
            {registerErrors.username && <p className={styles.errorText}>{registerErrors.username.message}</p>}
            
            <input className={styles.authInput} type="email" placeholder="Email" {...signupRegister('email')} />
            {registerErrors.email && <p className={styles.errorText}>{registerErrors.email.message}</p>}
            
            <input className={styles.authInput} type="tel" placeholder="Teléfono" {...signupRegister('phone')} />
            {registerErrors.phone && <p className={styles.errorText}>{registerErrors.phone.message}</p>}
            
            <input className={styles.authInput} type="password" placeholder="Contraseña" {...signupRegister('password')} />
            {registerErrors.password && <p className={styles.errorText}>{registerErrors.password.message}</p>}
            
            <input className={styles.authInput} type="password" placeholder="Confirmar contraseña" {...signupRegister('confirmPassword')} />
            {registerErrors.confirmPassword && <p className={styles.errorText}>{registerErrors.confirmPassword.message}</p>}
            
            <button className={styles.authButton} type="submit" disabled={isRegisterLoading}>
              {isRegisterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Registrarse
            </button>
          </form>
        </div>
        
        {/* Sign In Container */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.authForm} onSubmit={handleLoginSubmit(onLoginSubmit)}>
            <h1>Iniciar Sesión</h1>
            <span>conecta con tu comunidad</span>
            
            <input className={styles.authInput} type="email" placeholder="Email" {...loginRegister('email')} />
            {loginErrors.email && <p className={styles.errorText}>{loginErrors.email.message}</p>}
            
            <input className={styles.authInput} type="password" placeholder="Contraseña" {...loginRegister('password')} />
            {loginErrors.password && <p className={styles.errorText}>{loginErrors.password.message}</p>}
            
            <a href="#">¿Olvidaste tu contraseña?</a>
            <button className={styles.authButton} type="submit" disabled={isLoginLoading}>
              {isLoginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Entrar
            </button>
          </form>
        </div>
        
        {/* Overlay Container */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1 className="text-white">¡Bienvenido de nuevo!</h1>
              <p>Para mantenerte conectado con la comunidad, inicia sesión con tu información personal</p>
              <button className={`${styles.authButton} ${styles.ghost}`} onClick={() => setIsRightPanelActive(false)}>
                Iniciar Sesión
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1 className="text-white">¡Hola, Motero!</h1>
              <p>Introduce tus datos personales y únete a la mayor comunidad de motos de España</p>
              <button className={`${styles.authButton} ${styles.ghost}`} onClick={() => setIsRightPanelActive(true)}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
