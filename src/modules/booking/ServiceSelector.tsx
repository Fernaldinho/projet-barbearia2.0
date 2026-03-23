import type { Service } from '@/types'
import { cn } from '@/utils/helpers'

interface ServiceSelectorProps {
  services: Service[]
  selectedId: string | null
  onSelect: (service: Service) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function ServiceSelector({ services, selectedId, onSelect }: ServiceSelectorProps) {
  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl lg:text-5xl font-black font-headline text-white uppercase tracking-tighter leading-none">
          O que vamos <span className="text-[#fbbf24]">fazer hoje?</span>
        </h2>
        <p className="text-[#D3C5AC] text-lg font-light leading-relaxed max-w-xl">
          Selecione os serviços premium para sua próxima experiência exclusiva.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((service) => {
          const isSelected = selectedId === service.id
          
          // Icon mapping
          const getIconName = () => {
            const name = service.name.toLowerCase()
            if (name.includes('corte') && name.includes('barba')) return 'star'
            if (name.includes('barba')) return 'face'
            if (name.includes('massagem') || name.includes('platinado') || name.includes('luzes')) return 'spa'
            return 'content_cut'
          }

          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={cn(
                "group relative p-8 rounded-[2.5rem] border text-left transition-all duration-500 overflow-hidden",
                isSelected 
                  ? "bg-[#fbbf24] border-transparent shadow-[0_0_40px_rgba(251,191,36,0.2)] scale-[1.02]" 
                  : "bg-[#1C1B1B] border-white/5 hover:border-[#fbbf24]/30 hover:bg-[#201F1F]"
              )}
            >
              {/* Glossy overlay on selected */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shimmer"></div>
              )}

              <div className="flex flex-col h-full justify-between gap-10">
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                    isSelected ? "bg-[#402D00] text-[#fbbf24]" : "bg-[#353534] text-[#fbbf24]"
                  )}>
                    <span className="material-symbols-outlined text-4xl">
                      {getIconName()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-2xl font-black font-headline tracking-tighter",
                      isSelected ? "text-[#402D00]" : "text-[#fbbf24]"
                    )}>
                      {formatCurrency(service.price).replace(',00', '')}
                    </p>
                    <p className={cn(
                      "text-[10px] uppercase font-black tracking-widest mt-1",
                      isSelected ? "text-[#402D00]/60" : "text-zinc-600"
                    )}>
                      {service.duration} MINUTOS
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className={cn(
                    "text-2xl font-black font-headline uppercase tracking-tight mb-2",
                    isSelected ? "text-[#402D00]" : "text-[#E5E2E1]"
                  )}>
                    {service.name}
                  </h3>
                  <p className={cn(
                    "text-xs leading-relaxed font-medium line-clamp-2",
                    isSelected ? "text-[#402D00]/70" : "text-[#D3C5AC]/50"
                  )}>
                    {service.description || 'Experiência exclusiva com produtos premium e consultoria personalizada.'}
                  </p>
                </div>
              </div>

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-4 right-4 text-[#402D00]">
                  <span className="material-symbols-outlined font-black">check_circle</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
