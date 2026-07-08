import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { Order } from '../../lib/types'

export function PublicSupervisorPage() {
  const { token } = useParams()
  const query = useQuery({ queryKey: ['public-supervisor', token], queryFn: () => api<Order[]>(`/public/supervisor/${token}/orders`) })

  return (
    <main className="public-screen">
      <section className="public-panel wide">
        <p className="eyebrow">Supervisor externo</p>
        <h1>Órdenes</h1>
        <div className="supervisor-table">
          {(query.data ?? []).map((order) => (
            <div className="table-row" key={order.id}>
              <strong>{order.orderNumber}</strong>
              <span>{order.customerName}</span>
              <span>{order.technician?.name ?? 'Sin técnico'}</span>
              <span className="status-pill" style={{ backgroundColor: order.status.color }}>{order.status.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
