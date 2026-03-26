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
    <div className="animate-fade-in pb-20 space-y-16 mt-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 px-4 lg:px-0">
        <div className="space-y-4">
          <span className="text-xs tracking-[0.3em] uppercase font-label text-[#fbbf24] font-bold block">Gestão de Relacionamento</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter text-[#E5E2E1] uppercase leading-none">Clientes</h1>
          <p className="text-[#D3C5AC] text-lg font-light leading-relaxed max-w-2xl">
            Sua base de dados premium. Acompanhe a jornada de cada cliente e antecipe suas necessidades.
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="bg-[#fbbf24] text-[#402D00] font-headline font-bold px-8 py-4 rounded-full flex items-center gap-3 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          ADICIONAR CLIENTE
        </button>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-0">
        <div className="bg-[#1C1B1B] p-8 rounded-[2rem] border border-white/5 group hover:bg-[#201F1F] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Total de Clientes</p>
              <p className="text-3xl lg:text-4xl font-headline font-black text-[#E5E2E1] tracking-tighter">{totalClients}</p>
            </div>
            <div className="bg-[#353534] p-3 sm:p-5 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform shadow-inner">
              <Users className="w-6 h-6 sm:w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-[#1C1B1B] p-8 rounded-[2rem] border border-white/5 group hover:bg-[#201F1F] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Ativos este Mês</p>
              <p className="text-3xl lg:text-4xl font-headline font-black text-[#E5E2E1] tracking-tighter">{activeThisMonth}</p>
            </div>
            <div className="bg-[#353534] p-3 sm:p-5 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform shadow-inner">
              <TrendingUp className="w-6 h-6 sm:w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-[#1C1B1B] p-8 rounded-[2rem] border border-white/5 group hover:bg-[#201F1F] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Taxa de Fidelidade</p>
              <p className="text-3xl lg:text-4xl font-headline font-black text-[#E5E2E1] tracking-tighter">{taxaFidelidade}%</p>
            </div>
            <div className="bg-[#fbbf24]/10 p-3 sm:p-5 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform shadow-inner">
              <ShieldCheck className="w-6 h-6 sm:w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 lg:px-0 space-y-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 group-focus-within:text-[#fbbf24] transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1C1B1B] border border-white/5 rounded-3xl py-6 pl-16 pr-8 text-white focus:border-[#fbbf24]/50 transition-all outline-none font-medium text-lg placeholder:text-zinc-700"
            />
          </div>
          <Link 
            to="/birthdays"
            className="bg-[#1C1B1B] border border-white/5 rounded-3xl px-8 py-6 flex items-center gap-4 text-white hover:border-[#fbbf24]/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24] group-hover:scale-110 transition-transform">
              <Cake className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Próximos</p>
              <p className="text-sm font-bold uppercase tracking-tight">Aniversários</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#fbbf24]" />
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
