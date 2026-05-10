import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Loader } from '@/components/common/Loader'

interface ProtectedRouteProps {
  element: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  // Wait for localStorage hydration before deciding redirect
  if (!isHydrated) {
    return <Loader fullScreen size="lg" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />
  }

  return <>{element}</>
}
