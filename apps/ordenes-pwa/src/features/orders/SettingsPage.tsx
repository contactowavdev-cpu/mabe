import { Copy, Link2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { api } from '../../lib/api'

export function SettingsPage() {
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)

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
    </section>
  )
}
