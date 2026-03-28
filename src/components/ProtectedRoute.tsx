import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext'
import { ROUTES } from '@/utils/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { company, loading: companyLoading, initializedForUser } = useCompany()
  const location = useLocation()

  const isAuthFinished = !loading
  const hasUser = !!user
  
  // A empresa foi carregada ou falhou para o usuário atual?
  const isCompanyInitialized = initializedForUser === (user?.id || 'none')

  // Se o Auth ainda não acabou OU se temos Usuário mas a Empresa ainda está sendo buscada para este usuário específico
  if (!isAuthFinished || (hasUser && !isCompanyInitialized)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c0c0c]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm font-medium">Sincronizando...</span>
        </div>
      </div>
    )
  }

  // Se chegamos aqui, isAuthFinished é true e (se houver user) isCompanyInitialized é true.
  
  // 1. Se não houver usuário, vai para o login
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // 2. Se houver usuário mas nenhuma empresa vinculada, volta para o login (estado inválido)
  if (!company) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }
  
  return <>{children}</>
}
