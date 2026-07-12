import { Copy, Link2, ShieldCheck, UserPlus } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'
import { api } from '../../lib/api'
import { useAuthStore } from '../../lib/auth-store'
import { Order, Role, User } from '../../lib/types'

const elevatedRoles = new Set(['superadmin', 'admin', 'supervisor'])
const money = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' })
const number = new Intl.NumberFormat('es-GT', { maximumFractionDigits: 2 })

function toNumber(value: unknown) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export function SettingsPage() {
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'technician' as Role,
  })
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()
  const canSeeReports = elevatedRoles.has(user?.role ?? '')
  const isSuperadmin = user?.role === 'superadmin'
  const ordersQuery = useQuery({
    queryKey: ['orders', 'admin-report'],
    queryFn: () => api<Order[]>('/orders'),
    enabled: canSeeReports,
  })
  const usersQuery = useQuery({
    queryKey: ['users', 'manageable'],
    queryFn: () => api<User[]>('/users'),
    enabled: isSuperadmin,
  })
  const createUser = useMutation({
    mutationFn: () => api<User>('/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    }),
    onSuccess: async () => {
      setNewUser({ name: '', email: '', phone: '', password: '', role: 'technician' })
      await queryClient.invalidateQueries({ queryKey: ['users', 'manageable'] })
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : 'No se pudo crear el usuario.')
    },
  })

  const technicianRows = Array.from((ordersQuery.data ?? []).reduce((groups, order) => {
    const technicianName = order.technician?.name ?? 'Sin tecnico'
    const current = groups.get(technicianName) ?? {
      technicianName,
      total: 0,
      completed: 0,
      active: 0,
      payment: 0,
      kilometers: 0,
      fuel: 0,
    }
    current.total += 1
    current.completed += order.isCompleted ? 1 : 0
    current.active += order.isCompleted ? 0 : 1
    current.payment += toNumber(order.orderPayment)
    current.kilometers += toNumber(order.kilometersTraveled)
    current.fuel += toNumber(order.fuelCost)
    groups.set(technicianName, current)
    return groups
  }, new Map<string, {
    technicianName: string
    total: number
    completed: number
    active: number
    payment: number
    kilometers: number
    fuel: number
  }>()).values()).sort((a, b) => b.completed - a.completed)

  async function createSupervisorLink() {
    setLoading(true)
    try {
      const result = await api<{ token: string }>('/supervisor-links', {
        method: 'POST',
        body: JSON.stringify({ days: 7 }),
      })
      const nextLink = `${location.origin}/public/supervisor/${result.token}`
      setLink(nextLink)
      await navigator.clipboard.writeText(nextLink)
    } catch {
      alert('No se pudo crear el link. Revisa que el API y la base de datos esten activos.')
    } finally {
      setLoading(false)
    }
  }

  function updateNewUser(field: keyof typeof newUser, value: string) {
    setNewUser((current) => ({ ...current, [field]: value }))
  }

  function submitNewUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createUser.mutate()
  }

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Configuracion</p>
          <h2>Supervisor externo</h2>
        </div>
      </div>

      <article className="settings-card">
        <ShieldCheck size={28} />
        <div>
          <h3>Link temporal</h3>
          <p>Comparte una vista de solo lectura para revisar ordenes, fotos y firmas.</p>
        </div>
        <button className="secondary-button" onClick={createSupervisorLink} disabled={loading}>
          <Copy size={18} /> {loading ? 'Creando...' : link ? 'Copiar nuevo link' : 'Crear link 7 dias'}
        </button>
        {link ? <p className="muted breakable">{link}</p> : null}
      </article>

      <article className="settings-card">
        <Link2 size={28} />
        <div>
          <h3>Vencimiento recomendado</h3>
          <p>7 dias para supervision temporal. El link se guarda en la base de datos y valida vencimiento.</p>
        </div>
      </article>

      {isSuperadmin ? (
        <article className="settings-card user-management-card">
          <UserPlus size={28} />
          <div>
            <p className="eyebrow">Super administrador</p>
            <h3>Crear tecnicos y administradores</h3>
            <p>Estos usuarios podran entrar al sistema con el rol asignado.</p>
          </div>
          <form className="user-create-form" onSubmit={submitNewUser}>
            <label>
              Nombre completo
              <input value={newUser.name} onChange={(event) => updateNewUser('name', event.target.value)} required />
            </label>
            <label>
              Correo
              <input type="email" value={newUser.email} onChange={(event) => updateNewUser('email', event.target.value)} required />
            </label>
            <label>
              Telefono
              <input value={newUser.phone} onChange={(event) => updateNewUser('phone', event.target.value)} />
            </label>
            <label>
              Rol
              <select value={newUser.role} onChange={(event) => updateNewUser('role', event.target.value)}>
                <option value="technician">Tecnico</option>
                <option value="admin">Administrador</option>
              </select>
            </label>
            <label>
              Contrasena temporal
              <input
                type="password"
                minLength={8}
                value={newUser.password}
                onChange={(event) => updateNewUser('password', event.target.value)}
                required
              />
            </label>
            <button className="primary-button" type="submit" disabled={createUser.isPending}>
              <UserPlus size={18} /> {createUser.isPending ? 'Creando...' : 'Crear usuario'}
            </button>
          </form>
          <div className="user-list">
            {usersQuery.isLoading ? <p className="muted">Cargando usuarios...</p> : null}
            {usersQuery.data?.map((managedUser) => (
              <div className="user-row" key={managedUser.id}>
                <strong>{managedUser.name}</strong>
                <span>{managedUser.email}</span>
                <span>{managedUser.role === 'admin' ? 'Administrador' : 'Tecnico'}</span>
                <span>{managedUser.active ? 'Activo' : 'Inactivo'}</span>
              </div>
            ))}
            {!usersQuery.isLoading && !usersQuery.data?.length ? (
              <p className="muted">Aun no hay tecnicos ni administradores registrados.</p>
            ) : null}
          </div>
        </article>
      ) : null}

      {canSeeReports ? (
        <article className="settings-card">
          <div>
            <p className="eyebrow">Administracion</p>
            <h3>Resumen por tecnico</h3>
            <p>Control de ordenes realizadas, activas, pago total y distancia registrada.</p>
          </div>
          {ordersQuery.isLoading ? <p className="muted">Cargando reporte...</p> : null}
          <div className="report-table">
            <div className="report-row report-head">
              <span>Tecnico</span>
              <span>Ordenes</span>
              <span>Finalizadas</span>
              <span>Pago</span>
              <span>Gasolina</span>
              <span>Distancia</span>
            </div>
            {technicianRows.map((row) => (
              <div className="report-row" key={row.technicianName}>
                <strong>{row.technicianName}</strong>
                <span>{row.total} total / {row.active} activas</span>
                <span>{row.completed}</span>
                <span>{money.format(row.payment)}</span>
                <span>{money.format(row.fuel)}</span>
                <span>{number.format(row.kilometers)} km</span>
              </div>
            ))}
            {!ordersQuery.isLoading && !technicianRows.length ? <p className="muted">Aun no hay ordenes para reportar.</p> : null}
          </div>
        </article>
      ) : null}
    </section>
  )
}
