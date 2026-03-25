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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in px-4">
      <div className="bg-bg-surface w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-border-subtle">
        
        {/* Header Section */}
        <div className="px-6 py-8 md:px-10 md:py-10 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Scissors className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-headline tracking-tight uppercase">
                {initialData ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <p className="text-[10px] text-text-muted/60 font-black uppercase tracking-widest mt-1">
                {initialData ? 'Refinamento do portfólio' : 'Expansão de catálogo premium'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8">
          
          {/* Service Name */}
          <div className="form-group">
            <label htmlFor="service-name" className="form-label">Nome do Serviço</label>
            <div className="relative group">
               <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/20 group-focus-within:text-primary transition-colors" />
               <input
                id="service-name"
                type="text"
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Corte Artístico"
                className="input-base pl-12"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="service-description" className="form-label">Descrição Adicional</label>
            <div className="relative group">
               <Info className="absolute left-4 top-5 w-5 h-5 text-text-muted/20 group-focus-within:text-primary transition-colors" />
               <textarea
                id="service-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Diferenciais e detalhes técnicos..."
                className="input-base pl-12 py-4 h-auto resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {/* Duration */}
            <div className="form-group">
              <label htmlFor="service-duration" className="form-label">Tempo (Min)</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/20 group-focus-within:text-primary transition-colors" />
                <input
                  id="service-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  min="5"
                  step="5"
                  className="input-base pl-12"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="service-price" className="form-label">Investimento (R$)</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                <input
                  id="service-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                  className="input-base pl-12"
                  required
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <label className="flex items-center gap-4 cursor-pointer group bg-white/2 p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-6 h-6 rounded-lg border-2 border-border-subtle peer-checked:border-primary peer-checked:bg-primary transition-all" />
              <Check className="w-4 h-4 text-primary-text absolute left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Serviço Ativo</span>
              <span className="text-[10px] text-text-muted/40 font-bold uppercase tracking-widest">Disponível para portfólio</span>
            </div>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary h-12"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary h-12"
            >
              {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
