import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import type { Company, PlanFeatures } from '@/types'
import { PLAN_FEATURES, PLANS } from '@/utils/constants'

interface CompanyContextType {
  company: Company | null
  plan: PlanFeatures
  loading: boolean
  features: {
    hasReports: boolean
    hasBilling: boolean
    maxClients: number
    maxServices: number
    maxAppointmentsPerMonth: number
  }
  refreshCompany: () => Promise<void>
  updateCompany: (data: Partial<Company>) => Promise<void>
  initializedForUser: string | null
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkedForUserId, setCheckedForUserId] = useState<string | null>(null)

  const plan = company
    ? PLAN_FEATURES[company.plan as keyof typeof PLAN_FEATURES]
    : PLAN_FEATURES[PLANS.FREE]

  const features = {
    hasReports: plan.hasReports,
    hasBilling: plan.hasBilling,
    maxClients: plan.maxClients,
    maxServices: plan.maxServices,
    maxAppointmentsPerMonth: plan.maxAppointmentsPerMonth,
    maxBusinessDays: (plan as any).maxBusinessDays || 7,
  }

  const fetchCompany = async () => {
    setLoading(true)
    if (!user) {
      setCompany(null)
      setLoading(false)
      return
    }

    try {
      // 1. Buscar o perfil do usuário para ver qual empresa ele pertence
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single()

      if (profileError || !profile?.company_id) {
        setCompany(null)
        setLoading(false)
        return
      }

      // 2. Buscar os dados completos da empresa
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single()

      if (error) {
        setCompany(null)
      } else {
        setCompany(data)
      }
    } catch (_err) {
      setCompany(null)
    } finally {
      setLoading(false)
      setCheckedForUserId(user?.id || 'none')
    }
  }

  const refreshCompany = async () => {
    setLoading(true)
    await fetchCompany()
  }

  const updateCompany = async (data: Partial<Company>) => {
    if (!company?.id) return
    const { error } = await supabase
      .from('companies')
      .update(data)
      .eq('id', company.id)

    if (error) throw error
    await fetchCompany()
  }

  useEffect(() => {
    // Se o auth ainda está carregando, não faz nada
    if (user === undefined) return 

    fetchCompany()
  }, [user?.id])

  return (
    <CompanyContext.Provider
      value={{
        company,
        plan,
        loading,
        features,
        refreshCompany: fetchCompany,
        updateCompany,
        initializedForUser: checkedForUserId
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}
