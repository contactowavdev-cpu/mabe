import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import { AppShell } from './shell'
import { LoginPage } from '../features/auth/LoginPage'
import { DashboardPage } from '../features/orders/DashboardPage'
import { NewOrderPage } from '../features/orders/NewOrderPage'
import { OrderDetailPage } from '../features/orders/OrderDetailPage'
import { PdfImportPage } from '../features/orders/PdfImportPage'
import { PublicOrderPage } from '../features/public/PublicOrderPage'
import { PublicSupervisorPage } from '../features/public/PublicSupervisorPage'
import { SettingsPage } from '../features/orders/SettingsPage'
import { useAuthStore } from '../lib/auth-store'

function Protected({ children }: { children: ReactElement }) {
  const token = useAuthStore((state) => state.accessToken)
  return token ? children : <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/public/order/:token', element: <PublicOrderPage /> },
  { path: '/public/supervisor/:token', element: <PublicSupervisorPage /> },
  {
    path: '/',
    element: (
      <Protected>
        <AppShell />
      </Protected>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'orders/new', element: <NewOrderPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'pdf-imports/new', element: <PdfImportPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
