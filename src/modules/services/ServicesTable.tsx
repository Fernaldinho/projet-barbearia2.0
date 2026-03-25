import { Scissors, Star, User, Sparkles, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import type { Service } from '@/types'
import { formatCurrency, cn } from '@/utils/helpers'

interface ServicesTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
  onToggleStatus: (service: Service) => void
  maxServices?: number
}

export function ServicesTable({ services, onEdit, onDelete, onToggleStatus, maxServices }: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <div className="card-premium py-16 text-center">
        <p className="text-text-muted font-medium">Nenhum serviço encontrado no catálogo premium.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {services.map((service, index) => {
        const isBestseller = service.name.toLowerCase().includes('signature') || 
                            service.name.toLowerCase().includes('combo')
        
        const isInactive = !service.is_active
        const isBlocked = maxServices !== undefined && maxServices !== -1 && index >= maxServices

        return (
          <div 
            key={service.id} 
            className={cn(
              "card-premium group flex flex-col h-full transition-all duration-500",
              isInactive && "opacity-60 grayscale",
              isBlocked && "blur-[6px] opacity-40 select-none pointer-events-none"
            )}
          >
            {/* Top: Icon and Toggle */}
            <div className="flex justify-between items-start mb-8">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl",
                isBestseller ? "bg-primary text-primary-text shadow-primary/20" : "bg-white/5 text-primary border border-white/5"
              )}>
                {isBestseller ? <Star className="w-7 h-7" /> : <Scissors className="w-7 h-7" />}
              </div>

              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => onToggleStatus(service)}
                  title={service.is_active ? 'Desativar' : 'Ativar'}
                  className="flex flex-col items-end gap-1.5 group/toggle"
                >
                  <div className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300",
                    service.is_active ? "bg-primary" : "bg-white/10"
                  )}>
                    <span className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-bg-base transition-transform duration-300",
                      service.is_active ? "translate-x-6" : "translate-x-1"
                    )} />
                  </div>
                  <span className={cn(
                    "text-[8px] uppercase font-black tracking-widest transition-colors",
                    service.is_active ? "text-primary" : "text-text-muted/40"
                  )}>
                    {service.is_active ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {isBestseller && (
                <div className="flex items-center gap-2 mb-3">
                   <div className="h-0.5 w-6 bg-primary rounded-full"></div>
                   <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">Bestseller</span>
                </div>
              )}
              <h3 className={cn(
                "font-headline text-2xl font-bold mb-3 transition-colors uppercase tracking-tight",
                isBestseller ? "text-primary" : "text-white group-hover:text-primary"
              )}>
                {service.name}
              </h3>
              <p className="text-text-muted text-sm line-clamp-3 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                {service.description || 'Experiência exclusiva com produtos premium e consultoria personalizada.'}
              </p>
            </div>

            {/* Price and Actions */}
            <div className="mt-8 pt-8 border-t border-white/5 flex items-end justify-between">
               <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black tracking-widest text-text-muted/30 mb-1">Investimento</span>
                <span className="font-headline font-bold text-primary text-3xl">
                  {formatCurrency(service.price).replace(',00', '')}
                </span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(service)}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-primary-text hover:border-primary transition-all active:scale-90"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(service.id)}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-90"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

