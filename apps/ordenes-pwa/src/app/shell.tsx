import { FileUp, Home, LogOut, Plus, Settings } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/auth-store'

export function AppShell() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const canOperateOrders = user?.role === 'technician' || user?.role === 'superadmin'

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <img src="/pwa-icon.svg" alt="Mabe" />
          <div>
            <p className="eyebrow">Panel de campo</p>
            <h1>Mabe ordenes tecnicas</h1>
            <span>{user?.name ?? 'Usuario'}</span>
          </div>
        </div>
        <button className="icon-button" title="Cerrar sesion" onClick={() => { logout(); navigate('/login') }}>
          <LogOut size={20} />
        </button>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <nav className="mobile-nav" aria-label="Navegacion principal">
        <NavLink to="/" title="Ordenes"><Home size={21} /><span>Ordenes</span></NavLink>
        {canOperateOrders ? <NavLink to="/orders/new" title="Nueva orden"><Plus size={22} /><span>Nueva</span></NavLink> : null}
        {canOperateOrders ? <NavLink to="/pdf-imports/new" title="Importar PDF"><FileUp size={21} /><span>PDF</span></NavLink> : null}
        <NavLink to="/settings" title="Ajustes"><Settings size={21} /><span>Ajustes</span></NavLink>
      </nav>
    </div>
  )
}
