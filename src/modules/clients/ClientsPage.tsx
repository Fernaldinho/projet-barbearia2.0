import { useEffect, useState, useMemo, useCallback } from 'react'
import { Plus, UserPlus, Search, Users, TrendingUp, ShieldCheck, Lightbulb, Sparkles, ArrowRight } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { ClientsTable } from './ClientsTable'
import { ClientsForm } from './ClientsForm'
import { getClients, createClient, updateClient, deleteClient } from './clients.api'
import type { Client, ClientFormData } from '@/types'
import { cn } from '@/utils/helpers'

export function ClientsPage() {
  const { company } = useCompany()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadClients = useCallback(async () => {
    if (!company?.id) return
    setLoading(true)
    try {
      const data = await getClients(company.id)
      setClients(data)
    } catch (err) {
      console.error('Error loading clients:', err)
    } finally {
      setLoading(false)
    }
  }, [company?.id])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const handleCreate = async (data: ClientFormData) => {
    if (!company?.id) return
    await createClient(company.id, data)
    setShowForm(false)
    await loadClients()
  }

  const handleUpdate = async (data: ClientFormData) => {
    if (!editingClient || !company?.id) return
    await updateClient(company.id, editingClient.id, data)
    setEditingClient(null)
    await loadClients()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return
    await deleteClient(id)
    await loadClients()
  }

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients
    const lower = searchTerm.toLowerCase()
    return clients.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      (c.phone && c.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')))
    )
  }, [clients, searchTerm])

  return (
    <div className="animate-fade-in pb-20 space-y-12 mt-8">
      {/* Search Bar Section */}
      <div className="flex items-center px-4 lg:px-0">
        <div className="relative flex items-center group flex-1 max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#fbbf24] transition-colors">search</span>
          <input 
            className="w-full bg-[#0e0e0e] border-none py-3.5 pl-12 pr-6 rounded-full text-sm focus:ring-1 focus:ring-[#fbbf24] placeholder:text-zinc-600 transition-all outline-none text-[#E5E2E1]" 
            placeholder="Pesquisar clientes por nome ou telefone..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="text-left">
            <span className="text-xs font-label text-[#fbbf24] uppercase tracking-[0.3em] font-black block mb-4">CRM & Relacionamento</span>
            <h1 className="text-6xl font-headline font-black text-[#E5E2E1] leading-none tracking-tighter uppercase">Clientes</h1>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#fbbf24] text-[#402D00] px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">person_add</span>
            NOVO CLIENTE
          </button>
        </div>

        {/* Dashboard Stats Summary (Bento Lite) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#1C1B1B] p-8 rounded-[2rem] flex items-center justify-between group hover:bg-[#201F1F] transition-all border border-white/5">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Total de Clientes</p>
              <p className="text-4xl font-headline font-black text-[#E5E2E1] tracking-tighter">{clients.length}</p>
            </div>
            <div className="bg-[#fbbf24]/10 p-5 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform shadow-inner">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <div className="bg-[#1C1B1B] p-8 rounded-[2rem] flex items-center justify-between group hover:bg-[#201F1F] transition-all border border-white/5">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Novos este Mês</p>
              <p className="text-4xl font-headline font-black text-[#E5E2E1] tracking-tighter">+12</p>
            </div>
            <div className="bg-[#fbbf24]/10 p-5 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform shadow-inner">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
          <div className="bg-[#1C1B1B] p-8 rounded-[2rem] flex items-center justify-between group hover:bg-[#201F1F] transition-all border border-white/5">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Taxa de Retenção</p>
              <p className="text-4xl font-headline font-black text-[#E5E2E1] tracking-tighter">84%</p>
            </div>
            <div className="bg-[#fbbf24]/10 p-5 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Client Table Container */}
        {loading ? (
          <div className="bg-[#1C1B1B] rounded-[2.5rem] h-96 animate-pulse" />
        ) : (
          <ClientsTable 
            clients={filteredClients} 
            onEdit={(c) => setEditingClient(c)} 
            onDelete={handleDelete} 
          />
        )}

        {/* Contextual Insights Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#1C1B1B] to-[#131313] border border-white/5 shadow-2xl">
            <h3 className="font-headline text-2xl font-black text-white uppercase tracking-tighter mb-8 bg-zinc-900/50 p-4 rounded-2xl inline-block -ml-4">
              Insights de Clientes
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-6 p-6 rounded-3xl bg-[#0e0e0e] border border-white/[0.02] hover:border-[#fbbf24]/20 transition-all group">
                <div className="bg-[#fbbf24]/10 p-3 rounded-xl text-[#fbbf24] group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white tracking-tight">Oportunidade de Reengajamento</p>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                    12 clientes fiéis não agendam há mais de 30 dias. Considere enviar uma oferta personalizada via WhatsApp.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6 p-6 rounded-3xl bg-[#0e0e0e] border border-white/[0.02] hover:border-[#fbbf24]/20 transition-all group">
                <div className="bg-[#fbbf24]/10 p-3 rounded-xl text-[#fbbf24] group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white tracking-tight">Aniversários da Semana</p>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                    5 clientes fazem aniversário nos próximos 7 dias. Prepare o brinde de fidelidade especial!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] group border border-white/5 shadow-2xl h-full min-h-[400px]">
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 group-hover:scale-110 transition-transform duration-1000" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB1CDi9QrKlkvk8BKnZ3-M6T6TKVKVByml0IhIno84riqyH_S1_-9qKsxHUDsQPHuOj23W19Ju_dEYspFYprToowk9DdMuY3vd8kIPem-wxUNKO7LVMg1YOReSuxLNu3haELSJ-f0GtXaWTvtRpVWqFNq2YyNrMcCK1RNl3dX5pJmyzA1MQ-5a4upK3R47mDfBsjH0-SyjrlsBs9GVC9fPxM9zpx7lQLsLkQ7Q91nvrgi77Pjuh4Lffc-aZvXOGRoMxqE3DUjSOY5c" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent"></div>
            <div className="relative p-12 flex flex-col h-full justify-between">
              <div>
                <span className="bg-[#fbbf24] text-[#402D00] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Premium AI</span>
                <h3 className="font-headline text-4xl font-black mt-6 leading-none text-white tracking-tighter uppercase">Relatórios Avançados<br/>de Consumo</h3>
              </div>
              <div className="space-y-6">
                <p className="text-zinc-400 text-base font-medium max-w-sm leading-relaxed">
                  Analise o comportamento de compra e as preferências de estilo de cada cliente de forma automática com nossa IA.
                </p>
                <a className="text-[#fbbf24] flex items-center gap-2 font-black text-sm group-hover:gap-6 transition-all uppercase tracking-widest" href="#">
                  Ver Relatórios Detalhados
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 px-10 py-10 border-t border-white/5 text-center">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black">
          © 2026 AgendaAI Precision Noir Experience. Todos os direitos reservados.
        </p>
      </footer>

      {showForm && <ClientsForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editingClient && <ClientsForm initialData={editingClient} onSubmit={handleUpdate} onClose={() => setEditingClient(null)} />}
    </div>
  )
}
