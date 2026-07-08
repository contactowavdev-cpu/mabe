import { create } from 'zustand'
import { User } from './types'

type AuthState = {
  user?: User
  accessToken?: string
  refreshToken?: string
  setSession: (session: { user: User; accessToken: string; refreshToken: string }) => void
  logout: () => void
}

function readStoredSession() {
  const stored = localStorage.getItem('ordenes.session')
  if (!stored) return {}

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem('ordenes.session')
    return {}
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...readStoredSession(),
  setSession: (session) => {
    localStorage.setItem('ordenes.session', JSON.stringify(session))
    set(session)
  },
  logout: () => {
    localStorage.removeItem('ordenes.session')
    set({ user: undefined, accessToken: undefined, refreshToken: undefined })
  },
}))
