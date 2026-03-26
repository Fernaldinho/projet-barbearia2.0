import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ArrowRight, ShieldCheck, Users, TrendingUp, Cake } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCompany } from '@/contexts/CompanyContext'
import { getClients, createClient, updateClient, deleteClient } from './clients.api'
import { ClientsTable } from './ClientsTable'
import { ClientsForm } from './ClientsForm'
import { ClientHistoryModal } from './ClientHistoryModal'
import type { Client, ClientFormData } from '@/types'

export function ClientsPage() {
  const { company, features } = useCompany()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [historyClient, setHistoryClient] = useState<Client | null>(null)

  const loadClients = useCallback(async () => {
    if (!company?.id) return
    setLoading(true)
    try {
      const data = await getClients(company.id)
      setClients(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [company?.id])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreate = async (data: ClientFormData) => {
    if (!company?.id) return
    await createClient(company.id, data)
    toast.success('Cliente cadastrado com sucesso!')
    setShowForm(false)
    await loadClients()
  }

  const handleUpdate = async (data: ClientFormData) => {
    if (!editingClient || !company?.id) return
    await updateClient(company.id, editingClient.id, data)
    setEditingClient(null)
    toast.success('Dados do cliente atualizados.')
    await loadClients()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return
    try {
      await deleteClient(id)
      toast.success('Cliente removido.')
      await loadClients()
    } catch (err: any) {
      toast.error('Erro ao excluir: ' + err.message)
    }
  }

  const totalClients = clients.length
  const activeThisMonth = clients.filter(c => {
    const appointments = c.appointments || []
    if (appointments.length === 0) return false
    
    return appointments.some(app => {
      if (!app.date) return false
      const date = new Date(app.date)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
  }).length
  
  const taxaFidelidade = totalClients > 0 ? Math.round((activeThisMonth / totalClients) * 100) : 0

  return (
    <div className="animate-fade-in pb-8 space-y-4 sm:space-y-8 mt-2 sm:mt-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-8 px-4 lg:px-0">
        <div className="space-y-1 sm:space-y-4">
          <span className="text-[9px] sm:text-xs tracking-[0.2em] uppercase font-label text-[#fbbf24] font-bold block">Gestão de Relacionamento</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter text-[#E5E2E1] uppercase leading-none">Clientes</h1>
          <p className="text-[#D3C5AC]/80 text-xs sm:text-lg font-light leading-relaxed max-w-2xl">
            Sua base de dados premium. Acompanhe a jornada de cada cliente e antecipe suas necessidades.
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="w-full md:w-auto bg-[#fbbf24] text-[#402D00] font-headline font-bold px-5 py-2.5 sm:px-8 sm:py-4 rounded-full flex items-center justify-center gap-2 sm:gap-3 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all active:scale-95 group shadow-xl shadow-[#fbbf24]/10 text-[10px] sm:text-base"
        >
          <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
          ADICIONAR CLIENTE
        </button>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 px-4 lg:px-0">
        <div className="bg-[#1C1B1B] p-3 sm:p-8 rounded-2xl border border-white/5 group hover:bg-[#201F1F] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-black mb-1 sm:mb-2">Total</p>
              <p className="text-lg sm:text-3xl lg:text-4xl font-headline font-black text-[#E5E2E1] tracking-tighter">{totalClients}</p>
            </div>
            <div className="bg-[#353534] p-2 sm:p-5 rounded-lg sm:rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform shadow-inner">
              <Users className="w-4 h-4 sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>

        <div className="bg-[#1C1B1B] p-3 sm:p-8 rounded-2xl border border-white/5 group hover:bg-[#201F1F] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-black mb-1 sm:mb-2">Ativos</p>
              <p className="text-lg sm:text-3xl lg:text-4xl font-headline font-black text-[#E5E2E1] tracking-tighter">{activeThisMonth}</p>
            </div>
            <div className="bg-[#353534] p-2 sm:p-5 rounded-lg sm:rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform shadow-inner">
              <TrendingUp className="w-4 h-4 sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>

        <div className="bg-[#1C1B1B] p-3 sm:p-8 rounded-2xl border border-white/5 group hover:bg-[#201F1F] transition-all col-span-2 md:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-black mb-1 sm:mb-2">Fidelidade</p>
              <p className="text-lg sm:text-3xl lg:text-4xl font-headline font-black text-[#E5E2E1] tracking-tighter">{taxaFidelidade}%</p>
            </div>
            <div className="bg-[#fbbf24]/10 p-2 sm:p-5 rounded-lg sm:rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform shadow-inner">
              <ShieldCheck className="w-4 h-4 sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 lg:px-0 space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4 group-focus-within:text-[#fbbf24] transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1C1B1B] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-[#E5E2E1] focus:border-[#fbbf24]/50 transition-all outline-none font-medium text-xs sm:text-sm placeholder:text-zinc-700"
            />
          </div>
          <Link 
            to="/birthdays"
            className="bg-[#1C1B1B] border border-white/5 rounded-2xl px-6 py-3 flex items-center gap-3 text-white hover:border-[#fbbf24]/30 transition-all group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24] group-hover:scale-110 transition-transform">
              <Cake className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Próximos</p>
              <p className="text-xs font-bold uppercase tracking-tight">Aniversários</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#fbbf24] ml-auto sm:ml-0" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-[#1C1B1B] rounded-[2.5rem] h-96 animate-pulse" />
        ) : (
          <ClientsTable 
            clients={filteredClients} 
            maxClients={features?.maxClients}
            onEdit={(c) => setEditingClient(c)} 
            onDelete={handleDelete} 
            onViewHistory={(c) => setHistoryClient(c)}
          />
        )}
      </div>

      <footer className="mt-20 px-10 py-10 border-t border-white/5 text-center">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black">
          © 2026 AgendaAI Precision Noir Experience. Todos os direitos reservados.
        </p>
      </footer>

      {showForm && <ClientsForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editingClient && <ClientsForm initialData={editingClient} onSubmit={handleUpdate} onClose={() => setEditingClient(null)} />}
      {historyClient && <ClientHistoryModal client={historyClient} onClose={() => setHistoryClient(null)} />}
    </div>
  )
}
