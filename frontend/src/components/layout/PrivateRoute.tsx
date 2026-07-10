import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 animate-pulse" />
        <p className="text-neutral-500 text-sm">Loading LeadForge…</p>
      </div>
    </div>
  )
  return user ? <>{children}</> : <Navigate to="/login" replace />
}
