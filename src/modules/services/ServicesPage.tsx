import { useEffect, useState, useCallback } from 'react'
import { Plus, Scissors, Search } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { ServicesTable } from './ServicesTable' // This will be renamed/refactored to card list
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
    <div className="space-y-[60px] animate-fade-in pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <span className="font-label text-primary-container tracking-[0.4em] uppercase text-xs block mb-4">Gerenciamento</span>
          <h1 className="text-5xl lg:text-8xl font-black text-white font-headline leading-[0.9] tracking-tighter uppercase">
            SERVIÇOS<span className="text-primary-container">.</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-medium mt-8 leading-relaxed max-w-2xl">
            Sua vitrine de experiências. Transforme o simples em <span className="text-white italic">extraordinário</span> através de um catálogo meticulosamente planejado.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(true)} 
          className="bg-primary-container text-on-primary-fixed h-16 px-10 rounded-full font-black text-xs tracking-widest shadow-[0_20px_40px_rgba(255,191,0,0.15)] hover:scale-[1.05] hover:shadow-primary-container/30 transition-all flex items-center gap-4 self-start lg:self-end active:scale-95 group"
        >
          <Scissors className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          ADICIONAR SERVIÇO
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-wrap items-center gap-8">
        <div className="relative group flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-on-surface-variant/30 group-focus-within:text-primary-container transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Encontrar serviço no catálogo..."
            className="w-full bg-surface-container-low h-16 pl-16 pr-8 rounded-full text-white placeholder:text-on-surface-variant/20 border border-outline-variant/10 focus:border-primary-container/30 focus:bg-surface-container-highest transition-all outline-none font-bold text-sm tracking-wide"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="bg-surface-container-low px-8 h-16 flex flex-col justify-center rounded-3xl border border-outline-variant/5">
            <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Total</span>
            <span className="text-xl font-bold text-white font-headline leading-none">{services.length}</span>
          </div>
          <div className="bg-surface-container-low px-8 h-16 flex flex-col justify-center rounded-3xl border border-outline-variant/5">
            <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Ativos</span>
            <span className="text-xl font-bold text-primary-container font-headline leading-none">{services.filter(s => s.is_active).length}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[300px] rounded-[2.5rem] bg-surface-container-low animate-pulse" />
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
