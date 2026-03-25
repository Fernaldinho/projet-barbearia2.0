import { useEffect, useState, useMemo, useCallback } from 'react'
import { Plus, UserPlus, Search, Users, TrendingUp, ShieldCheck, Lightbulb, Sparkles, ArrowRight } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { ClientsTable } from './ClientsTable'
import { ClientsForm } from './ClientsForm'
import { getClients, createClient, updateClient, deleteClient } from './clients.api'
import type { Client, ClientFormData } from '@/types'
import { cn } from '@/utils/helpers'
import { ClientHistoryModal } from './ClientHistoryModal'

export function ClientsPage() {
  const { company, features } = useCompany()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [historyClient, setHistoryClient] = useState<Client | null>(null)
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
    if (features.maxClients !== -1 && clients.length >= features.maxClients) {
       alert(`Aviso: Seu plano permite apenas ${features.maxClients} clientes. Faça o upgrade para adicionar mais.`)
       return
    }
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
    try {
      await deleteClient(id)
      await loadClients()
    } catch (err: any) {
      alert('Erro ao excluir cliente: ' + err.message)
    }
  }

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients
    const lower = searchTerm.toLowerCase()
    return clients.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      (c.phone && c.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')))
    )
  }, [clients, searchTerm])

  const novosEsteMes = useMemo(() => {
    const now = new Date();
    return clients.filter(c => {
      const d = new Date(c.created_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  }, [clients])

  const taxaFidelidade = useMemo(() => {
    if (!clients.length) return 0
    const fieis = clients.filter(c => c.appointments && c.appointments.length > 1).length
    return Math.round((fieis / clients.length) * 100)
  }, [clients])

  return (
    <div className="animate-fade-in pb-20 space-y-12">
      {/* Search Bar Section */}
      <div className="flex items-center">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/40 group-focus-within:text-primary transition-colors" />
          <input 
            className="input-base pl-12 h-12" 
            placeholder="Pesquisar clientes por nome ou telefone..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-caption uppercase tracking-[0.3em] text-primary/60 mb-3 block font-bold">CRM & Relacionamento</span>
            <h1 className="mb-4">CLIENTES</h1>
            <p className="text-p text-lg">Gerencie sua base de clientes com precisão cirúrgica. Foco total em fidelidade e retenção.</p>
          </div>
          <button 
            onClick={() => {
              if (features.maxClients !== -1 && clients.length >= features.maxClients) {
                alert(`Plano Gratuito atinge o limite máximo de ${features.maxClients} clientes.`)
              }
              setShowForm(true)
            }}
            className="btn-primary"
          >
            <UserPlus className="w-5 h-5" />
            NOVO CLIENTE
          </button>
        </div>

        {/* Dashboard Stats Summary (Bento Lite) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="card-premium p-8 flex items-center justify-between group transition-all">
            <div>
              <p className="text-text-muted text-[10px] uppercase font-black tracking-widest mb-2 opacity-40">Total de Clientes</p>
              <p className="font-headline font-bold text-white text-4xl">{clients.length}</p>
            </div>
            <div className="bg-primary/10 p-5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <div className="card-premium p-8 flex items-center justify-between group transition-all">
            <div>
              <p className="text-text-muted text-[10px] uppercase font-black tracking-widest mb-2 opacity-40">Novos este Mês</p>
              <p className="font-headline font-bold text-white text-4xl">{novosEsteMes}</p>
            </div>
            <div className="bg-primary/10 p-5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
          <div className="card-premium p-8 flex items-center justify-between group transition-all">
            <div>
              <p className="text-text-muted text-[10px] uppercase font-black tracking-widest mb-2 opacity-40">Taxa de Fidelidade</p>
              <p className="font-headline font-bold text-white text-4xl">{taxaFidelidade}%</p>
            </div>
            <div className="bg-primary/10 p-5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Client Table Container */}
        {loading ? (
          <div className="card-premium h-96 animate-pulse" />
        ) : (
          <ClientsTable 
            clients={filteredClients} 
            maxClients={features.maxClients}
            onEdit={(c) => setEditingClient(c)} 
            onDelete={handleDelete} 
            onViewHistory={(c) => setHistoryClient(c)}
          />
        )}

        {/* Contextual Insights Section */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          <div className="card-premium p-8 md:p-12">
            <h3 className="font-headline text-2xl font-bold text-white uppercase tracking-tight mb-10 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              Insights de CRM
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-6 p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-primary/20 transition-all group">
                <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white tracking-tight uppercase text-sm">Oportunidade</p>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed opacity-60">
                    12 clientes fiéis não agendam há mais de 30 dias. Envie uma oferta via WhatsApp.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6 p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-primary/20 transition-all group">
                <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white tracking-tight uppercase text-sm">Aniversários</p>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed opacity-60">
                    5 clientes fazem aniversário nos próximos 7 dias. Prepare o brinde especial!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium p-0 relative overflow-hidden group min-h-[400px]">
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 group-hover:scale-110 transition-transform duration-1000" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB1CDi9QrKlkvk8BKnZ3-M6T6TKVKVByml0IhIno84riqyH_S1_-9qKsxHUDsQPHuOj23W19Ju_dEYspFYprToowk9DdMuY3vd8kIPem-wxUNKO7LVMg1YOReSuxLNu3haELSJ-f0GtXaWTvtRpVWqFNq2YyNrMcCK1RNl3dX5pJmyzA1MQ-5a4upK3R47mDfBsjH0-SyjrlsBs9GVC9fPxM9zpx7lQLsLkQ7Q91nvrgi77Pjuh4Lffc-aZvXOGRoMxqE3DUjSOY5c" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent"></div>
            <div className="relative p-10 md:p-12 flex flex-col h-full justify-between">
              <div>
                <span className="bg-primary text-primary-text px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Premium AI</span>
                <h3 className="font-headline text-4xl font-black mt-6 leading-none text-white tracking-tighter uppercase">ANÁLISE DE<br/>RECORRÊNCIA</h3>
              </div>
              <div className="space-y-6">
                <p className="text-text-muted text-base font-medium max-w-sm leading-relaxed opacity-60">
                  Analise o comportamento de compra e as preferências de cada cliente automaticamente.
                </p>
                <div className="flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest font-black text-[11px] text-primary cursor-pointer">
                  Acessar Dashboard CRM <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && <ClientsForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editingClient && <ClientsForm initialData={editingClient} onSubmit={handleUpdate} onClose={() => setEditingClient(null)} />}
      {historyClient && <ClientHistoryModal client={historyClient} onClose={() => setHistoryClient(null)} />}
    </div>
  )
}
