import type { Service } from '@/types'
import { formatCurrency, cn } from '@/utils/helpers'

interface ServicesTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <div className="p-16 text-center rounded-[2rem] bg-surface-container-low border border-outline-variant/10">
        <p className="text-on-surface-variant font-medium">Nenhum serviço encontrado no catálogo premium.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => {
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
            onClick={() => onEdit(service)}
            className={cn(
              "group p-8 rounded-[2rem] transition-all duration-500 flex flex-col justify-between h-[420px] relative border cursor-pointer",
              isBestseller 
                ? "bg-gradient-to-br from-[#1C1B1B] to-[#FBBF24]/5 hover:to-[#FBBF24]/10 border-[#FBBF24]/20" 
                : "bg-[#1C1B1B] hover:bg-[#201F1F] border-transparent hover:border-[#4F4633]/20",
              !service.is_active && "opacity-60 hover:opacity-100"
            )}
          >
            {/* Top: Icon and Toggle */}
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner",
                isBestseller ? "bg-[#FBBF24] text-[#402D00] shadow-[0_0_15px_rgba(251,191,36,0.3)]" : "bg-[#353534] text-[#FBBF24]"
              )}>
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: isBestseller ? "'FILL' 1" : "" }}>
                  {getIconName()}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                  <input type="checkbox" checked={service.is_active} className="sr-only peer" readOnly />
                  <div className="w-11 h-6 bg-[#353534] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#D3C5AC] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FBBF24] peer-checked:after:bg-[#402D00]"></div>
                </label>
                <span className={cn(
                  "text-[10px] uppercase font-bold tracking-widest mt-2 transition-colors",
                  service.is_active ? "text-[#FBBF24] opacity-80" : "text-[#D3C5AC]/40"
                )}>
                  {service.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>

            {/* Middle: Name and Description */}
            <div className="mt-8">
              {isBestseller && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FBBF24]/20 text-[#FBBF24] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                    Bestseller
                  </span>
                </div>
              )}
              <h3 className={cn(
                "font-headline text-2xl font-bold mb-3 transition-colors",
                isBestseller ? "text-[#FBBF24]" : "text-[#E5E2E1] group-hover:text-[#FBBF24]"
              )}>
                {service.name}
              </h3>
              <p className="text-[#D3C5AC]/60 text-sm line-clamp-3 leading-relaxed">
                {service.description || 'Experiência exclusiva com produtos premium e consultoria personalizada.'}
              </p>
            </div>

            {/* Bottom: Stats */}
            <div className={cn(
              "mt-auto pt-8 flex items-center justify-between border-t",
              isBestseller ? "border-[#FBBF24]/10" : "border-[#4F4633]/10"
            )}>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-tighter text-[#D3C5AC]/60">Tempo</span>
                <span className="font-headline font-medium text-[#E5E2E1]">{service.duration} min</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  {isBestseller && (
                    <>
                      <span className="text-[10px] line-through text-[#D3C5AC]/40">{formatCurrency(service.price * 1.15)}</span>
                      <span className="text-[10px] uppercase tracking-tighter text-[#FBBF24]">Especial</span>
                    </>
                  )}
                  {!isBestseller && (
                    <span className="text-[10px] uppercase tracking-tighter text-[#D3C5AC]/60">Invetimento</span>
                  )}
                </div>
                <span className={cn(
                  "font-headline font-bold text-[#FBBF24]",
                  isBestseller ? "text-3xl font-black" : "text-2xl"
                )}>
                  {formatCurrency(service.price).replace(',00', '')}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

