import { useEffect, useState, useCallback } from 'react'
import { Plus, Scissors, Search, Sparkles, TrendingUp, Bell, Settings as SettingsIcon, User as UserIcon } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { ServicesTable } from './ServicesTable'
import { ServicesForm } from './ServicesForm'
import { getServices, createService, updateService, deleteService } from './services.api'
import type { Service, ServiceFormData } from '@/types'

export function ServicesPage() {
  const { company } = useCompany()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadServices = useCallback(async () => {
    if (!company?.id) return
    setLoading(true)
    try {
      const data = await getServices(company.id)
      setServices(data)
    } catch (err) {
      console.error('Error loading services:', err)
    } finally {
      setLoading(false)
    }
  }, [company?.id])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const handleCreate = async (data: ServiceFormData) => {
    if (!company?.id) return
    await createService(company.id, data)
    setShowForm(false)
    await loadServices()
  }

  const handleUpdate = async (data: ServiceFormData) => {
    if (!editingService) return
    await updateService(editingService.id, data)
    setEditingService(null)
    await loadServices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return
    await deleteService(id)
    await loadServices()
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
  }

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="relative group w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary-container transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar serviços..."
            className="w-full bg-transparent h-10 pl-10 pr-4 rounded-full text-white placeholder:text-on-surface-variant/30 transition-all outline-none font-medium text-sm border-none focus:ring-0 uppercase tracking-widest text-[10px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-8">
          <button className="text-on-surface-variant/60 hover:text-white transition-colors relative">
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary-container rounded-full border border-[#0e0e0e]" />
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-on-surface-variant/60 hover:text-white transition-colors">
            <SettingsIcon className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#1c1c1c] border border-white/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary-container/30 transition-all">
            <UserIcon className="w-6 h-6 text-on-surface-variant/40" />
          </div>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <span className="font-label text-primary-container tracking-[0.4em] uppercase text-[10px] font-black block mb-4">Gestão de Portfólio</span>
          <h1 className="text-6xl font-black text-white font-headline leading-tight tracking-tighter uppercase">
            SERVIÇOS
          </h1>
          <p className="text-lg text-on-surface-variant/70 font-medium mt-6 leading-relaxed max-w-xl">
            Gerencie seu menu de experiências com precisão cirúrgica. Defina valores, tempos e ativações premium.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(true)} 
          className="bg-primary-container text-on-primary-fixed h-14 px-8 rounded-full font-black text-xs tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center gap-4 self-start lg:self-end active:scale-95 group uppercase"
        >
          <Plus className="w-5 h-5" />
          Novo Serviço
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[300px] rounded-[2rem] bg-surface-container-low animate-pulse" />
          ))}
        </div>
      ) : (
        <ServicesTable 
          services={filteredServices} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}



      {/* Form Modal */}
      {showForm && (
        <ServicesForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}
      {editingService && (
        <ServicesForm
          initialData={editingService}
          onSubmit={handleUpdate}
          onClose={() => setEditingService(null)}
        />
      )}
    </div>
  )
}

