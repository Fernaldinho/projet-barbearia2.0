import { useState } from 'react'
import type { ServiceFormData, Service } from '@/types'
import { X, Scissors, Clock, DollarSign, Info, Check } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface ServicesFormProps {
  initialData?: Service | null
  onSubmit: (data: ServiceFormData) => Promise<void>
  onClose: () => void
}

export function ServicesForm({ initialData, onSubmit, onClose }: ServicesFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    duration: initialData?.duration || 30,
    price: initialData?.price || 0,
    is_active: initialData?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in px-4">
      <div className="bg-surface-container-low w-full max-w-[600px] rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden animate-scale-in relative border border-white/5">
        
        {/* Header Section */}
        <div className="p-8 lg:p-10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-container/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.1)]">
              <Scissors className="w-6 h-6 text-primary-container" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white font-headline tracking-tight">
                {initialData ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1 opacity-60">
                {initialData ? 'Atualize os detalhes da experiência' : 'Crie uma nova experiência premium'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-white/5 hover:text-white transition-all group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8">
          
          {/* Service Name */}
          <div className="space-y-3">
            <label htmlFor="service-name" className="text-[11px] font-bold text-primary-container uppercase tracking-[0.2em] ml-1">
              Nome do Serviço
            </label>
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Scissors className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary-container transition-colors" />
               </div>
               <input
                id="service-name"
                type="text"
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Corte Artístico & Barba"
                className="w-full bg-surface-container-lowest h-16 pl-14 pr-6 rounded-2xl text-white placeholder:text-on-surface-variant/20 focus:bg-surface-container-highest transition-all outline-none font-medium border border-transparent focus:border-primary-container/20 shadow-inner"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label htmlFor="service-description" className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] ml-1">
              Descrição (Opcional)
            </label>
            <div className="relative group">
               <div className="absolute top-5 left-0 pl-5 pointer-events-none">
                 <Info className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary-container transition-colors" />
               </div>
               <textarea
                id="service-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva os diferenciais deste serviço..."
                className="w-full bg-surface-container-lowest py-4 pl-14 pr-6 rounded-2xl text-white placeholder:text-on-surface-variant/20 focus:bg-surface-container-highest transition-all outline-none font-medium border border-transparent focus:border-primary-container/20 shadow-inner resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Duration */}
            <div className="space-y-3">
              <label htmlFor="service-duration" className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] ml-1">
                Duração (Minutos)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Clock className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary-container transition-colors" />
                </div>
                <input
                  id="service-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  min="5"
                  step="5"
                  className="w-full bg-surface-container-lowest h-16 pl-14 pr-6 rounded-2xl text-white placeholder:text-on-surface-variant/20 focus:bg-surface-container-highest transition-all outline-none font-medium border border-transparent focus:border-primary-container/20 shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3">
              <label htmlFor="service-price" className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] ml-1">
                Investimento (R$)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-primary-container transition-colors" />
                </div>
                <input
                  id="service-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                  className="w-full bg-surface-container-lowest h-16 pl-14 pr-6 rounded-2xl text-white placeholder:text-on-surface-variant/20 focus:bg-surface-container-highest transition-all outline-none font-medium border border-transparent focus:border-primary-container/20 shadow-inner"
                  required
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <label className="flex items-center gap-4 cursor-pointer group bg-white/[0.02] p-5 rounded-3xl hover:bg-white/[0.05] transition-colors">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-6 h-6 rounded-lg border-2 border-on-surface-variant/20 peer-checked:border-primary-container peer-checked:bg-primary-container transition-all" />
              <Check className="w-4 h-4 text-on-primary-fixed absolute left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Serviço Ativo</span>
              <span className="text-xs text-on-surface-variant/40 font-medium">Este serviço ficará visível para agendamento online</span>
            </div>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-5 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="text-on-surface-variant hover:text-white font-bold text-xs uppercase tracking-widest px-8 h-14 rounded-full hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-primary-container text-on-primary-fixed px-10 h-14 rounded-full font-bold shadow-xl shadow-primary-container/20 hover:scale-[1.05] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 uppercase text-xs tracking-widest"
            >
              {loading ? 'Sincronizando...' : initialData ? 'Salvar Alterações' : 'Confirmar Criação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
