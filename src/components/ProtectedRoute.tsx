import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext'
import { ROUTES } from '@/utils/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { company, loading: companyLoading } = useCompany()
  const location = useLocation()

  if (loading || (companyLoading && !company)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c0c0c]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm font-medium">Sincronizando...</span>
        </div>
      </div>
    )
  }

  if (!user || (!company && !companyLoading)) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }
  
  return <>{children}</>
}
