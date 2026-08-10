import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingUser } = useAuth()

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="font-body text-text-secondary">Chargement...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}