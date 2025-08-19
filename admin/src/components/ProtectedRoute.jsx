// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const ProtectedRoute = ({ children }) => {
  const { authUser, checkingAuth } = useAuthStore()

  if (checkingAuth) return null // or a spinner

  return authUser ? children : <Navigate to="/auth" />
}

export default ProtectedRoute
