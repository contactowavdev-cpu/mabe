import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuthStore } from '../../lib/auth-store'
import { User } from '../../lib/types'

type LoginForm = { email: string; password: string }

export function LoginPage() {
  const { register, handleSubmit, formState } = useForm<LoginForm>({
    defaultValues: { email: 'admin@ordenes.local', password: 'Admin123!' },
  })
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()

  async function onSubmit(values: LoginForm) {
    try {
      const session = await api<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      setSession(session)
      navigate('/')
    } catch {
      alert('No se pudo iniciar sesion. Revisa que el API este corriendo.')
    }
  }

  return (
    <main className="login-screen">
      <form className="login-panel" onSubmit={handleSubmit(onSubmit)}>
        <div className="login-brand">
          <img src="/pwa-icon.svg" alt="Mabe" />
          <strong>Mabe</strong>
        </div>
        <p className="eyebrow">Acceso tecnico</p>
        <h1>Gestion de ordenes</h1>
        <p className="muted">Ingresa para consultar, actualizar y cerrar ordenes desde campo.</p>
        <label>Email<input type="email" {...register('email', { required: true })} /></label>
        <label>Contrasena<input type="password" {...register('password', { required: true })} /></label>
        <button className="primary-button" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
        <small className="muted">Conexion obligatoria al API real configurado.</small>
      </form>
    </main>
  )
}
