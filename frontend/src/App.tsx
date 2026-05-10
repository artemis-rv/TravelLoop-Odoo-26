import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { AppRoutes } from '@/routes/AppRoutes'
import { initializeSocket } from '@/services/socket'

export default function App() {
  const hydrateFromStorage = useAuthStore((state) => state.hydrateFromStorage)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    // Restore auth state from localStorage on app load
    hydrateFromStorage()
  }, [hydrateFromStorage])

  useEffect(() => {
    // Initialize socket connection when authenticated
    if (isAuthenticated) {
      initializeSocket()
    }
  }, [isAuthenticated])

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" />
    </BrowserRouter>
  )
}
