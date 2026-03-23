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
    <div className="animate-fade-in pb-20">
      {/* TopAppBar Component Style */}
      <header className="w-full h-16 sticky top-0 z-40 bg-[#131313]/80 backdrop-blur-xl flex items-center justify-between px-8 border-none -mx-8 lg:-mx-12 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center group">
            <span className="material-symbols-outlined absolute left-3 text-[#E5E2E1]/40 group-focus-within:text-[#FBBF24] transition-colors">search</span>
            <input 
              className="bg-[#1c1b1b] border-none rounded-full pl-10 pr-6 py-2 text-sm focus:ring-1 focus:ring-[#FBBF24] w-64 text-[#E5E2E1] placeholder-[#E5E2E1]/20 outline-none transition-all" 
              placeholder="Buscar serviços..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-[#E5E2E1]/60 hover:text-[#FBBF24] transition-colors duration-300 active:scale-95 relative">
            <span className="material-symbols-outlined">notifications</span>
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FBBF24] rounded-full border border-[#131313]" />
          </button>
          <button className="text-[#E5E2E1]/60 hover:text-[#FBBF24] transition-colors duration-300 active:scale-95">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#504532]/20 overflow-hidden cursor-pointer hover:border-[#FBBF24]/40 transition-all">
            <img 
              alt="Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2iGjNxsvNxuJsGkgQPx1GJ_1gplo5RMAw2-txsLk3-GMpC4ZIKsWiRJKJm1mvoB7pA-N_tVQxGMZYFB5ddfrq3lHZnKSdKVgRAWZ9Jn-08jkENgcIGTExceTQQCsE9TkarQ8ac226zAsRwt105VAu_BJl3q15l6L8ABMVmupClzAV85VNUeWMW90yRQK2dJxiL6oQwcTK-UwRInmVLpp5Pz_-ze1LPRNrd4RNI2tw8P_9Urwdnoem3ZWJaGAMxU2ia8DlAOkjMlLN" 
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        {/* Hero Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl text-left">
            <span className="font-label text-xs tracking-[0.3em] uppercase text-[#ffe1a7] mb-4 block">Gestão de Portfólio</span>
            <h1 className="font-headline text-6xl font-black text-[#E5E2E1] leading-none mb-6 tracking-tighter">SERVIÇOS</h1>
            <p className="text-[#D3C5AC] text-lg font-light leading-relaxed">Gerencie seu menu de experiências com precisão cirúrgica. Defina valores, tempos e ativações premium.</p>
          </div>

          <button 
            onClick={() => setShowForm(true)}
            className="group relative flex items-center gap-3 bg-[#fbbf24] text-[#402D00] px-8 py-4 rounded-full font-headline font-bold text-lg hover:pr-10 transition-all duration-300 active:scale-95 shadow-xl shadow-[#fbbf24]/10"
          >
            <span className="material-symbols-outlined">add</span>
            NOVO SERVIÇO
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[420px] rounded-[2rem] bg-[#1c1b1b] animate-pulse" />
            ))}
          </div>
        ) : (
          <ServicesTable 
            services={filteredServices} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
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

