import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Clock, CreditCard } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { formatCurrency } from '@/utils/helpers'
import { supabase } from '@/lib/supabase'

export function BillingPage() {
  const { company, plan } = useCompany()

  const [stats, setStats] = useState({ total: 0, received: 0, pending: 0 })

  useEffect(() => {
    if (!company?.id) return

    const loadStats = async () => {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('appointments')
        .select('status, service:services(price)')
        .eq('company_id', company.id)
        .gte('date', firstDay)
        .lte('date', lastDay)
        
      if (!error && data) {
        let received = 0
        let pending = 0

        data.forEach((app: any) => {
          const price = app.service?.price || 0
          if (app.status === 'completed') {
            received += price
          } else if (app.status === 'confirmed' || app.status === 'scheduled') {
            pending += price
          }
        })
        setStats({ total: received + pending, received, pending })
      }
    }
    loadStats()
  }, [company?.id])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Faturamento</h1>
        <p className="text-dark-300 mt-1">Acompanhe receitas, faturas e plano atual</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-6 border border-white/5 rounded-2xl bg-[#1C1B1B]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-success-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{formatCurrency(stats.total)}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Receita do mês</p>
        </div>

        <div className="card p-6 border border-white/5 rounded-2xl bg-[#1C1B1B]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#fbbf24]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{formatCurrency(stats.received)}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Recebido</p>
        </div>

        <div className="card p-6 border border-white/5 rounded-2xl bg-[#1C1B1B]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-info-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-info-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{formatCurrency(stats.pending)}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Pendente</p>
        </div>
      </div>

      {/* Plan Info */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Plano Atual</h3>
            <p className="text-sm text-dark-400">Plano {plan.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3 rounded-xl bg-dark-800">
            <p className="text-xs text-dark-400 mb-1">Clientes</p>
            <p className="text-sm font-semibold text-white">{plan.maxClients === -1 ? 'Ilimitado' : plan.maxClients}</p>
          </div>
          <div className="p-3 rounded-xl bg-dark-800">
            <p className="text-xs text-dark-400 mb-1">Serviços</p>
            <p className="text-sm font-semibold text-white">{plan.maxServices === -1 ? 'Ilimitado' : plan.maxServices}</p>
          </div>
          <div className="p-3 rounded-xl bg-dark-800">
            <p className="text-xs text-dark-400 mb-1">Agendamentos/mês</p>
            <p className="text-sm font-semibold text-white">{plan.maxAppointmentsPerMonth === -1 ? 'Ilimitado' : plan.maxAppointmentsPerMonth}</p>
          </div>
          <div className="p-3 rounded-xl bg-dark-800">
            <p className="text-xs text-dark-400 mb-1">Relatórios</p>
            <p className="text-sm font-semibold text-white">{plan.hasReports ? 'Incluído' : 'Não incluído'}</p>
          </div>
        </div>
      </div>

      {/* Invoices placeholder */}
      <div className="card p-12 text-center">
        <p className="text-dark-400 text-lg mb-2">Nenhuma fatura encontrada</p>
        <p className="text-dark-500 text-sm">As faturas aparecerão aqui quando houver movimentações financeiras.</p>
      </div>
    </div>
  )
}
