import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Clock, CreditCard } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { formatCurrency } from '@/utils/helpers'
import { supabase } from '@/lib/supabase'

export function BillingPage() {
  const { company, plan } = useCompany()

  const [stats, setStats] = useState({ total: 0, received: 0, pending: 0 })
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!company?.id) return

    const loadBillingData = async () => {
      setLoading(true)
      try {
        // Query Stats from appointments (as it was before)
        const today = new Date()
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]

        const { data: appData, error: appError } = await supabase
          .from('appointments')
          .select('status, service:services(price)')
          .eq('company_id', company.id)
          .gte('date', firstDay)
          .lte('date', lastDay)
          
        if (!appError && appData) {
          let received = 0
          let pending = 0

          appData.forEach((app: any) => {
            const price = app.service?.price || 0
            if (app.status === 'completed') {
              received += price
            } else if (app.status === 'confirmed' || app.status === 'scheduled') {
              pending += price
            }
          })
          setStats({ total: received + pending, received, pending })
        }

        // Load Real Invoices from the new table
        const { data: invData, error: invError } = await supabase
          .from('invoices')
          .select('*')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false })

        if (!invError && invData) {
          setInvoices(invData)
        }
      } catch (err) {
        console.error('Error loading billing data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBillingData()
  }, [company?.id])

  return (
    <div className="space-y-8 animate-fade-in px-4 lg:px-0">
      {/* Header */}
      <div className="mt-4 sm:mt-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">Faturamento</h1>
        <p className="text-zinc-500 mt-1 uppercase text-[8px] sm:text-[10px] font-black tracking-widest leading-none">Acompanhe receitas e plano atual</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="card p-6 sm:p-8 border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] bg-[#1C1B1B] hover:border-white/10 transition-all">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-success-500/10 flex items-center justify-center border border-success-500/10">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-success-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2 uppercase tracking-tighter leading-none">{formatCurrency(stats.total)}</p>
          <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">Previsão do mês</p>
        </div>

        <div className="card p-6 sm:p-8 border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] bg-[#1C1B1B] hover:border-white/10 transition-all">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#fbbf24]/10 flex items-center justify-center border border-[#fbbf24]/10">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#fbbf24]" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2 uppercase tracking-tighter leading-none">{formatCurrency(stats.received)}</p>
          <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">Receita Efetuada</p>
        </div>

        <div className="card p-6 sm:p-8 border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] bg-[#1C1B1B] hover:border-white/10 transition-all">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-500/10 flex items-center justify-center border border-white/5">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2 uppercase tracking-tighter leading-none">{formatCurrency(stats.pending)}</p>
          <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">Aguardando Conclusão</p>
        </div>
      </div>

      {/* Plan Info */}
      <div className="card p-10 border border-white/5 rounded-[3rem] bg-gradient-to-br from-[#1C1B1B] via-[#1C1B1B] to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fbbf24]/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[#fbbf24] text-[#402D00] flex items-center justify-center shadow-2xl shadow-[#fbbf24]/20">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#fbbf24] uppercase tracking-[0.3em] mb-2 block">Assinatura Ativa</span>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Plano {plan.name}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1">Clientes</p>
                <p className="text-sm font-bold text-white tracking-tight leading-none">{plan.maxClients === -1 ? '∞' : plan.maxClients}</p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1">Serviços</p>
                <p className="text-sm font-bold text-white tracking-tight leading-none">{plan.maxServices === -1 ? '∞' : plan.maxServices}</p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1">Limite</p>
                <p className="text-sm font-bold text-white tracking-tight leading-none">{plan.maxAppointmentsPerMonth === -1 ? '∞' : plan.maxAppointmentsPerMonth}</p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1">Relatórios</p>
                <p className="text-sm font-bold text-white tracking-tight leading-none">{plan.hasReports ? 'SIM' : 'NÃO'}</p>
            </div>
          </div>
        </div>

        {plan.name === 'Gratuito' && (
          <div className="mt-12 p-1 bg-gradient-to-r from-transparent via-[#fbbf24]/10 to-transparent rounded-full mb-8"></div>
        )}

        {plan.name === 'Gratuito' && (
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-md text-center md:text-left">
              <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Pronto para crescer?</h4>
              <p className="text-sm text-zinc-500 font-medium">Libere todas as funcionalidades PRO e remova os limites de agendamentos e clientes agora.</p>
            </div>
            <a 
              href={`https://pay.kirvano.com/435f6ec9-afb0-4405-8e12-8d49bbf652d6?metadata_company_id=${company?.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-12 py-6 bg-[#fbbf24] text-[#402D00] rounded-full font-black text-xs uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all text-center shadow-2xl shadow-[#fbbf24]/20 flex items-center justify-center gap-2 group"
            >
              Fazer Upgrade PRO
              <TrendingUp className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        )}
      </div>

      {/* Invoices List */}
      <div className="pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              Histórico
              <span className="text-[10px] font-black bg-white/5 border border-white/5 px-3 py-1 rounded-full text-zinc-500 uppercase tracking-widest">{invoices.length} Faturas</span>
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-[#1C1B1B] border border-white/5 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : invoices.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-8 bg-[#1C1B1B] border border-white/5 rounded-[2rem] hover:border-white/10 transition-all hover:bg-[#222121] group">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                    inv.status === 'paid' 
                      ? 'bg-success-500/10 text-success-500 border-success-500/10' 
                      : 'bg-zinc-500/10 text-zinc-500 border-white/5'
                  }`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-white uppercase text-sm tracking-tight mb-1">{inv.description}</p>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-black">
                            {new Date(inv.created_at).toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                        <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-black">
                            Ref: {inv.external_id?.substring(0, 8) || 'N/A'}
                        </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-2xl text-white uppercase tracking-tighter mb-1">{formatCurrency(inv.amount)}</p>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${
                    inv.status === 'paid' 
                      ? 'bg-success-500/10 text-success-500 border-success-500/10' 
                      : 'bg-zinc-500/10 text-zinc-500 border-white/5'
                  }`}>
                    {inv.status === 'paid' ? 'Liquidado' : inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-20 text-center border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
            <div className="w-20 h-20 bg-white/[0.03] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              <CreditCard className="w-10 h-10 text-zinc-700" />
            </div>
            <h5 className="text-white font-black uppercase tracking-tighter text-xl mb-2">Sem faturas ainda</h5>
            <p className="text-zinc-500 text-xs font-medium max-w-xs mx-auto">Suas faturas de assinatura e extratos aparecerão nesta seção automaticamente.</p>
          </div>
        )}
      </div>
    </div>
  )
}
