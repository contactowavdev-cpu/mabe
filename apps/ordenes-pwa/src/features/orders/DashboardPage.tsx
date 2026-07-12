import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, CalendarDays, MapPin, Phone, Search, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { api } from '../../lib/api'
import { useAuthStore } from '../../lib/auth-store'
import { cacheOrders, getCachedOrders } from '../../lib/offline'
import { Order } from '../../lib/types'

export function DashboardPage() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const canDeleteOrders = user?.role === 'technician' || user?.role === 'superadmin'
  const isAdminReview = user?.role === 'admin' || user?.role === 'supervisor'
  const query = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const orders = await api<Order[]>('/orders')
        await cacheOrders(orders)
        return orders
      } catch (error) {
        const cached = await getCachedOrders<Order[]>()
        if (cached) return cached
        throw error
      }
    },
  })
  const deleteOrder = useMutation({
    mutationFn: (id: string) => api(`/orders/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })

  const orders = query.data ?? []
  const activeOrders = orders.filter((order) => !order.isCompleted).length

  if (query.isLoading) return <p className="muted">Cargando ordenes...</p>
  if (!orders.length) return <EmptyState title="Sin ordenes" text="Crea una orden manual o importa datos desde PDF." />

  return (
    <section className="page-stack">
      <div className="dashboard-summary">
        <article>
          <span>Total</span>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <span>Activas</span>
          <strong>{activeOrders}</strong>
        </article>
        <article>
          <span>Finalizadas</span>
          <strong>{orders.length - activeOrders}</strong>
        </article>
      </div>

      <label className="search-box">
        <Search size={18} />
        <input placeholder="Buscar por orden, cliente o telefono" />
      </label>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Prioridad por estado</p>
          <h2>{isAdminReview ? 'Ordenes realizadas' : 'Ordenes asignadas'}</h2>
        </div>
      </div>

      <div className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card-head">
              <Link to={`/orders/${order.id}`}>
                <span className="order-number">#{order.orderNumber}</span>
                <h3>{order.customerName}</h3>
              </Link>
              <span className="status-pill" style={{ backgroundColor: order.status.color }}>{order.status.name}</span>
            </div>

            <Link className="order-card-body" to={`/orders/${order.id}`}>
              <p className="order-problem">
              <AlertCircle size={16} />
              {order.description1 || 'Sin falla registrada'}
              </p>

              <div className="meta-grid">
                <span><MapPin size={15} /> {order.neighborhood || 'Sin zona'}</span>
                <span><Phone size={15} /> {order.cellPhone || 'Sin telefono'}</span>
                <span><CalendarDays size={15} /> {new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
            </Link>

            {canDeleteOrders ? <div className="card-actions">
              <button
                className="danger-button subtle"
                onClick={() => {
                  if (confirm(`Eliminar la orden ${order.orderNumber}?`)) deleteOrder.mutate(order.id)
                }}
                disabled={deleteOrder.isPending}
              >
                <Trash2 size={16} /> Eliminar
              </button>
            </div> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
