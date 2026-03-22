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
    <div className="space-y-[40px] animate-fade-in pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl lg:text-6xl font-bold text-white font-headline leading-tight tracking-tight">
            Nossos <span className="text-primary-container">Serviços</span>.
          </h1>
          <p className="text-lg text-on-surface-variant font-medium mt-4">
            Gerencie o catálogo de experiências da sua barbearia. Defina preços, durações e o estilo que seus clientes merecem.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(true)} 
          className="bg-primary-container text-on-primary-fixed h-14 px-8 rounded-full font-bold shadow-lg shadow-primary-container/20 hover:scale-[1.02] transition-all flex items-center gap-3 self-start lg:self-end"
        >
          <Plus className="w-5 h-5" />
          ADICIONAR SERVIÇO
        </button>
      </div>

      {/* Search Bar - No Line Style */}
      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary-container transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Buscar serviço..."
          className="w-full bg-surface-container-low h-14 pl-14 pr-6 rounded-2xl text-white placeholder:text-on-surface-variant/30 focus:bg-surface-container-highest transition-all outline-none font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[200px] rounded-3xl bg-surface-container-low animate-pulse" />
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
