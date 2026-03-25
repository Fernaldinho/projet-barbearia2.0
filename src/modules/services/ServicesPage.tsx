import { useEffect, useState, useCallback } from 'react'
import { Plus, Scissors, Search, Sparkles, TrendingUp, Bell, Settings as SettingsIcon, User as UserIcon } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { ServicesTable } from './ServicesTable'
import { ServicesForm } from './ServicesForm'
import { getServices, createService, updateService, deleteService } from './services.api'
import type { Service, ServiceFormData } from '@/types'

export function ServicesPage() {
  const { company, features } = useCompany()
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
    if (features.maxServices !== -1 && services.length >= features.maxServices) {
       alert(`Aviso: Seu plano permite criar apenas ${features.maxServices} serviços. Faça o upgrade para adicionar mais.`)
       return
    }
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

  const handleToggleStatus = async (service: Service) => {
    try {
      await updateService(service.id, {
        is_active: !service.is_active
      })
      await loadServices()
    } catch (err) {
      console.error('Error toggling service status:', err)
    }
  }

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="animate-fade-in pb-20">
      {/* Search Bar Section */}
      <div className="flex items-center mb-8 md:mb-12">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/40 group-focus-within:text-primary transition-colors" />
          <input 
            className="input-base pl-12 h-12" 
            placeholder="Buscar serviços..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div>
        {/* Hero Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-caption uppercase tracking-[0.3em] text-primary/60 mb-3 block font-bold">Gestão de Portfólio</span>
            <h1 className="mb-4">SERVIÇOS</h1>
            <p className="text-p text-lg">Gerencie seu menu de experiências com precisão. Defina valores, tempos e ativações premium.</p>
          </div>

          <button 
            onClick={() => {
              if (features.maxServices !== -1 && services.length >= features.maxServices) {
                alert(`Plano Gratuito atinge o limite máximo de ${features.maxServices} serviços.`)
              }
              setShowForm(true)
            }}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            NOVO SERVIÇO
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 rounded-xl bg-bg-surface border border-border-subtle animate-pulse" />
            ))}
          </div>
        ) : (
          <ServicesTable 
            services={filteredServices} 
            maxServices={features.maxServices}
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* Form Modals */}
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

