import { useState, useCallback, useEffect } from 'react'
import { Search, Filter, Cake, ArrowLeft, Calendar, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCompany } from '@/contexts/CompanyContext'
import { supabase } from '@/lib/supabase'
import { cn } from '@/utils/helpers'
import { toast } from 'react-hot-toast'

type BirthdayFilter = 'week' | 'month' | 'year'

export function BirthdaysPage() {
  const { company } = useCompany()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<any[]>([])
  const [filter, setFilter] = useState<BirthdayFilter>('month')
  const [searchTerm, setSearchTerm] = useState('')

  const loadBirthdays = useCallback(async () => {
    if (!company?.id) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', company.id)
        .order('name')

      if (error) throw error

      const today = new Date()
      const currentYear = today.getFullYear()

      const filtered = (data || []).filter(client => {
        if (!client.birth_date) return false
        
        const birthDate = new Date(client.birth_date)
        const birthMonth = birthDate.getMonth()
        const birthDay = birthDate.getDate()
        
        // This year's birthday
        const thisYearBirthday = new Date(currentYear, birthMonth, birthDay)

        if (filter === 'month') {
          return birthMonth === today.getMonth()
        }

        if (filter === 'week') {
          const nextWeek = new Date(today)
          nextWeek.setDate(today.getDate() + 7)
          
          // Check if birthday falls between today and next week
          // We need to handle year transition (e.g. Dec 31 to Jan 2)
          return (thisYearBirthday >= today && thisYearBirthday <= nextWeek) ||
                 (new Date(currentYear + 1, birthMonth, birthDay) >= today && 
                  new Date(currentYear + 1, birthMonth, birthDay) <= nextWeek)
        }

        return true // 'year' filter shows all birthdays
      })

      setClients(filtered)
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao carregar aniversários')
    } finally {
      setLoading(false)
    }
  }, [company?.id, filter])

  useEffect(() => {
    loadBirthdays()
  }, [loadBirthdays])

  const filteredBySearch = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  )

  return (
    <div className="animate-fade-in pb-20 space-y-12 mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 px-4 lg:px-0">
        <div className="space-y-4">
          <Link to="/clients" className="text-[#fbbf24] flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:gap-4 transition-all">
            <ArrowLeft className="w-4 h-4" /> Voltar para Clientes
          </Link>
          <span className="text-xs tracking-[0.3em] uppercase font-label text-[#fbbf24] font-bold block">Celebrações & Fidelidade</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter text-[#E5E2E1] uppercase leading-none">Aniversariantes</h1>
          <p className="text-[#D3C5AC] text-lg font-light leading-relaxed max-w-2xl">
            Acompanhe os aniversários de seus clientes e prepare ofertas exclusivas para fortalecer o relacionamento.
          </p>
        </div>
      </div>

      {/* Stats & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 lg:px-0">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou celular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1C1B1B] border border-white/5 rounded-3xl py-6 pl-16 pr-8 text-white focus:border-[#fbbf24]/50 transition-all outline-none font-medium"
          />
        </div>

        <div className="md:col-span-2 flex gap-3 p-2 bg-[#1c1b1b] rounded-3xl border border-white/5">
          {(['week', 'month', 'year'] as BirthdayFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 py-4 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === f ? "bg-[#fbbf24] text-[#402D00] shadow-xl" : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {f === 'week' ? 'Na Semana' : f === 'month' ? 'No Mês' : 'No Ano'}
            </button>
          ))}
        </div>
      </div>

      {/* Birthdays List */}
      <div className="px-4 lg:px-0">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1C1B1B] rounded-[2rem] h-48 animate-pulse" />
            ))}
          </div>
        ) : filteredBySearch.length === 0 ? (
          <div className="bg-[#1C1B1B]/50 rounded-[2.5rem] p-20 text-center border border-dashed border-[#4F4633]/20">
            <Cake className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
            <p className="text-[#D3C5AC]/60 font-medium">Nenhum aniversariante encontrado para este período.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBySearch.map((client) => {
              const bDate = new Date(client.birth_date)
              const formattedDate = bDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
              const isBirthdayToday = bDate.getDate() === new Date().getDate() && bDate.getMonth() === new Date().getMonth()

              return (
                <div key={client.id} className={cn(
                  "bg-[#1C1B1B] p-8 rounded-[2rem] border border-white/5 group hover:bg-[#201F1F] transition-all relative overflow-hidden",
                  isBirthdayToday && "border-[#fbbf24]/30 bg-gradient-to-br from-[#1C1B1B] to-[#fbbf24]/5"
                )}>
                  {isBirthdayToday && (
                    <div className="absolute top-0 right-0 p-4">
                      <div className="bg-[#fbbf24] text-[#402D00] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-bounce">
                        É HOJE! 🎂
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#0e0e0e] flex items-center justify-center text-2xl font-black text-[#fbbf24] border border-white/5">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#fbbf24] transition-colors">{client.name}</h3>
                      <p className="text-[#fbbf24] text-xs font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </p>
                      <button 
                        onClick={() => window.open(`https://wa.me/55${client.phone?.replace(/\D/g, '')}`, '_blank')}
                        className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:gap-4 transition-all"
                      >
                        Enviar Parabéns <span className="material-symbols-outlined text-sm">send</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
