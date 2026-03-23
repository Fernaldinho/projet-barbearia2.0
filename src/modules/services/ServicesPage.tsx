import { useEffect, useState, useCallback } from 'react'
import { Plus, Scissors, Search, Sparkles, TrendingUp } from 'lucide-react'
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
    <div className="space-y-[60px] animate-fade-in pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <span className="font-label text-primary-container tracking-[0.4em] uppercase text-xs block mb-4">Gerenciamento de Serviços</span>
          <h1 className="text-5xl lg:text-8xl font-black text-white font-headline leading-[0.9] tracking-tighter uppercase">
            SERVIÇOS<span className="text-primary-container">.</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-medium mt-8 leading-relaxed max-w-2xl">
            Configure seu menu de experiências. Cada serviço é uma <span className="text-white italic">assinatura</span> de qualidade e precisão.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(true)} 
          className="bg-primary-container text-on-primary-fixed h-16 px-10 rounded-full font-black text-xs tracking-widest shadow-[0_20px_40px_rgba(255,191,0,0.15)] hover:scale-[1.05] hover:shadow-primary-container/30 transition-all flex items-center gap-4 self-start lg:self-end active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          ADICIONAR SERVIÇO
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-on-surface-variant/30 group-focus-within:text-primary-container transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Encontrar serviço no menu..."
          className="w-full bg-surface-container-low h-16 pl-16 pr-8 rounded-full text-white placeholder:text-on-surface-variant/20 border border-outline-variant/10 focus:border-primary-container/30 focus:bg-surface-container-highest transition-all outline-none font-bold text-sm tracking-wide"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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

      {/* AI Insight Card */}
      {!loading && services.length > 0 && (
        <div className="relative overflow-hidden p-8 lg:p-12 rounded-[3.5rem] bg-gradient-to-br from-surface-container-low to-surface-container-lowest border border-primary-container/10 group shadow-3xl">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-32 h-32 text-primary-container" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
            <div className="shrink-0 w-16 h-16 rounded-3xl bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
              <Sparkles className="w-8 h-8 text-on-primary-fixed" />
            </div>
            
            <div className="flex-1 space-y-4">
              <p className="text-[10px] font-black text-primary-container uppercase tracking-[0.4em]">AI Insight</p>
              <h3 className="text-3xl font-black text-white font-headline tracking-tight uppercase leading-none">Otimize sua agenda com o Combo Signature</h3>
              <p className="text-lg text-on-surface-variant/80 font-medium leading-relaxed max-w-3xl">
                Baseado nos dados do último mês, clientes que realizam o <span className="text-white">Combo Signature</span> têm 40% mais chances de retorno em menos de 20 dias. Considere destacar este serviço em sua vitrine digital.
              </p>
            </div>

            <button className="shrink-0 h-16 px-10 rounded-full border-2 border-primary-container/20 text-primary-container text-xs font-black tracking-widest hover:bg-primary-container hover:text-on-primary-fixed transition-all flex items-center gap-3">
              <TrendingUp className="w-4 h-4" />
              DESTACAR AGORA
            </button>
          </div>
        </div>
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

