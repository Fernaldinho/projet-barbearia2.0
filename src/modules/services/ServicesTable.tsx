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
      <div className="p-16 text-center rounded-[2rem] bg-surface-container-low border border-outline-variant/10">
        <p className="text-on-surface-variant font-medium">Nenhum serviço encontrado no catálogo premium.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => {
        const isBestseller = service.name.toLowerCase().includes('signature') || 
                            service.name.toLowerCase().includes('combo')
        
        // Match icons to Stitch HTML: content_cut, face, star, spa
        const getIconName = () => {
          if (isBestseller) return 'star'
          if (service.name.toLowerCase().includes('barba')) return 'face'
          if (service.name.toLowerCase().includes('massagem') || service.name.toLowerCase().includes('capilar')) return 'spa'
          return 'content_cut'
        }

        return (
          <div 
            key={service.id} 
            className={cn(
              "group p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] transition-all duration-700 flex flex-col min-h-[250px] lg:min-h-[300px] relative border overflow-hidden",
              isBestseller 
                ? "bg-gradient-to-br from-[#1C1B1B] to-[#FBBF24]/5 hover:to-[#FBBF24]/10 border-[#FBBF24]/20 shadow-2xl hover:shadow-[#FBBF24]/10" 
                : "bg-[#1C1B1B] hover:bg-[#201F1F] border-transparent hover:border-[#4F4633]/20 shadow-lg hover:shadow-black/40",
              !service.is_active && "opacity-60",
              maxServices !== undefined && maxServices !== -1 && index >= maxServices
                ? "blur-[4px] opacity-40 select-none pointer-events-none"
                : ""
            )}
          >
            {/* Glossy Overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none"></div>

            {/* Top: Icon and Toggle */}
            <div className="flex justify-between items-start relative z-10">
              <div className={cn(
                "w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.25rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 shadow-2xl group-hover:rotate-3",
                isBestseller ? "bg-[#FBBF24] text-[#402D00] shadow-[#FBBF24]/30" : "bg-[#353534] text-[#FBBF24]"
              )}>
                <span className="material-symbols-outlined text-2xl sm:text-4xl" style={{ fontVariationSettings: isBestseller ? "'FILL' 1" : "" }}>
                  {getIconName()}
                </span>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button 
                  onClick={() => onToggleStatus(service)}
                  className="group/toggle flex flex-col items-end gap-1"
                >
                  <div className={cn(
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 shadow-inner",
                    service.is_active ? "bg-[#FBBF24]" : "bg-[#353534]"
                  )}>
                    <span className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-[#1c1b1b] transition-transform duration-500 shadow-xl",
                      service.is_active ? "translate-x-6" : "translate-x-1"
                    )} />
                  </div>
                  <span className={cn(
                    "text-[9px] uppercase font-black tracking-[0.2em] transition-colors",
                    service.is_active ? "text-[#FBBF24]" : "text-zinc-600"
                  )}>
                    {service.is_active ? 'DESATIVAR' : 'ATIVAR'}
                  </span>
                </button>
              </div>
            </div>

            {/* Middle: Name and Description */}
            <div className="mt-6 relative z-10">
              {isBestseller && (
                <div className="flex items-center gap-2 mb-4">
                   <div className="h-1 w-8 bg-[#FBBF24] rounded-full"></div>
                   <span className="text-[#FBBF24] text-[10px] font-black uppercase tracking-[0.3em]">Bestseller</span>
                </div>
              )}
              <h3 className={cn(
                "font-headline text-2xl sm:text-3xl font-black mb-2 sm:mb-4 transition-colors tracking-tighter uppercase",
                isBestseller ? "text-[#FBBF24]" : "text-[#E5E2E1] group-hover:text-[#FBBF24]"
              )}>
                {service.name}
              </h3>
              <p className="text-[#D3C5AC]/50 text-sm line-clamp-2 leading-relaxed font-medium">
                {service.description || 'Experiência exclusiva com produtos premium e consultoria personalizada.'}
              </p>
            </div>

            {/* Price and Edit Button Area */}
            <div className={cn(
              "mt-auto pt-6 flex items-end justify-between border-t transition-colors",
              isBestseller ? "border-[#FBBF24]/10" : "border-[#4F4633]/10"
            )}>
               <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 mb-1">Preço Final</span>
                <span className={cn(
                  isBestseller ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl",
                  "font-headline font-black text-[#FBBF24] leading-none"
                )}>
                  {formatCurrency(service.price).replace(',00', '')}
                </span>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => onEdit(service)}
                  className="bg-[#0e0e0e] text-[#fbbf24] px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase border border-white/5 hover:border-[#fbbf24]/30 hover:bg-[#fbbf24]/5 transition-all active:scale-95 shadow-lg shadow-black/40"
                >
                  EDITAR
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

