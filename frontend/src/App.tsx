import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { AppRoutes } from '@/routes/AppRoutes'

export default function App() {
  const hydrateFromStorage = useAuthStore((state) => state.hydrateFromStorage)

  useEffect(() => {
    // Restore auth state from localStorage on app load
    hydrateFromStorage()
  }, [hydrateFromStorage])

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" />
    </BrowserRouter>
  )
}
