import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Loader } from '@/components/common/Loader'

interface ProtectedRouteProps {
  element: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  if (isLoading) {
    return <Loader fullScreen size="lg" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{element}</>
}
