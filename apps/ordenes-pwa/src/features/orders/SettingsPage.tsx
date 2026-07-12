import { Copy, Link2, ShieldCheck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../../lib/api'
import { useAuthStore } from '../../lib/auth-store'
import { Order } from '../../lib/types'

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
  const user = useAuthStore((state) => state.user)
  const canSeeReports = elevatedRoles.has(user?.role ?? '')
  const ordersQuery = useQuery({
    queryKey: ['orders', 'admin-report'],
    queryFn: () => api<Order[]>('/orders'),
    enabled: canSeeReports,
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
    }
    current.total += 1
    current.completed += order.isCompleted ? 1 : 0
    current.active += order.isCompleted ? 0 : 1
    current.payment += toNumber(order.orderPayment)
    current.kilometers += toNumber(order.kilometersTraveled)
    groups.set(technicianName, current)
    return groups
  }, new Map<string, {
    technicianName: string
    total: number
    completed: number
    active: number
    payment: number
    kilometers: number
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
              <span>Distancia</span>
            </div>
            {technicianRows.map((row) => (
              <div className="report-row" key={row.technicianName}>
                <strong>{row.technicianName}</strong>
                <span>{row.total} total / {row.active} activas</span>
                <span>{row.completed}</span>
                <span>{money.format(row.payment)}</span>
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
