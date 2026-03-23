import type { Service } from '@/types'
import { formatCurrency, cn } from '@/utils/helpers'
import { Clock, Scissors, Star, User, Zap } from 'lucide-react'

interface ServicesTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <div className="p-16 text-center rounded-[2rem] bg-surface-container-low border border-outline-variant/5">
        <p className="text-on-surface-variant font-medium">Nenhum serviço encontrado</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => {
        const isBestseller = service.name.toLowerCase().includes('signature') || 
                            service.name.toLowerCase().includes('combo')
        
        // Icon matching based on name (mock logic to match screenshot)
        const getIcon = () => {
          if (isBestseller) return <Star className="w-5 h-5 text-white" />
          if (service.name.toLowerCase().includes('barba')) return <User className="w-5 h-5 text-white" />
          return <Scissors className="w-5 h-5 text-white" />
        }

        return (
          <div 
            key={service.id} 
            onClick={() => onEdit(service)}
            className={cn(
              "group relative bg-[#1c1c1c] rounded-[2.5rem] p-10 flex flex-col justify-between transition-all duration-500 cursor-pointer hover:bg-[#252525] border border-white/5",
              isBestseller && "ring-1 ring-primary-container/30 bg-gradient-to-b from-[#1c1c1c] to-[#161616]"
            )}
          >
            {/* Top Row: Icon and Toggle */}
            <div className="flex items-center justify-between mb-10">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest/50 flex items-center justify-center">
                {getIcon()}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">Ativo</span>
                <div className={cn(
                  "w-10 h-5 rounded-full p-1 transition-colors duration-300",
                  service.is_active ? "bg-primary-container" : "bg-on-surface-variant/20"
                )}>
                  <div className={cn(
                    "w-3 h-3 bg-white rounded-full transition-transform duration-300",
                    service.is_active ? "translate-x-5" : "translate-x-0"
                  )} />
                </div>
              </div>
            </div>

            {/* Service Content */}
            <div className="flex-1 mb-12">
              {isBestseller && (
                <div className="inline-block px-3 py-1 bg-primary-container/10 border border-primary-container/20 text-primary-container text-[8px] font-black uppercase tracking-widest rounded-full mb-4">
                  Bestseller
                </div>
              )}
              <h3 className="text-3xl font-black text-white font-headline tracking-tighter uppercase mb-4 leading-tight">
                {service.name}
              </h3>
              <p className="text-sm text-on-surface-variant/50 font-medium leading-relaxed line-clamp-3">
                {service.description || 'Experiência exclusiva com atendimento personalizado e produtos de alta qualidade.'}
              </p>
            </div>

            {/* Bottom Row: Stats */}
            <div className="pt-8 border-t border-white/5 flex items-center gap-12">
              <div>
                <span className="text-[9px] font-black text-primary-container/60 uppercase tracking-[0.2em] block mb-2">Tempo</span>
                <p className="text-lg font-bold text-white tracking-tight">{service.duration} min</p>
              </div>
              
              <div>
                <span className="text-[9px] font-black text-primary-container/60 uppercase tracking-[0.2em] block mb-2">Investimento</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-headline tracking-tighter">
                    {formatCurrency(service.price)}
                  </span>
                  {isBestseller && (
                    <span className="text-[10px] font-black text-primary-container uppercase tracking-widest">Especial</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}



