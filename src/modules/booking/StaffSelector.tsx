import type { Staff } from '@/types'
import { cn } from '@/utils/helpers'
import { User, UserCircle } from 'lucide-react'

interface StaffSelectorProps {
  staff: Staff[]
  selectedId: string | null
  onSelect: (staff: Staff | null) => void
}

export function StaffSelector({ staff, selectedId, onSelect }: StaffSelectorProps) {
  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl lg:text-5xl font-black font-headline text-white uppercase tracking-tighter leading-none">
          Com quem você quer <span className="text-[#fbbf24]">agendar?</span>
        </h2>
        <p className="text-[#D3C5AC] text-lg font-light leading-relaxed max-w-xl">
          Selecione o seu barbeiro preferido ou escolha sem preferência para a primeira disponibilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* "Any" option */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "group relative p-8 rounded-[2.5rem] border text-left transition-all duration-500 overflow-hidden",
            selectedId === null
              ? "bg-[#fbbf24] border-transparent shadow-[0_0_40px_rgba(251,191,36,0.2)] scale-[1.02]" 
              : "bg-[#1C1B1B] border-white/5 hover:border-[#fbbf24]/30 hover:bg-[#201F1F]"
          )}
        >
          <div className="flex flex-col h-full justify-between gap-10">
            <div className={cn(
              "w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110",
              selectedId === null ? "bg-[#402D00] text-[#fbbf24]" : "bg-[#353534] text-[#fbbf24]"
            )}>
              <span className="material-symbols-outlined text-4xl">group</span>
            </div>
            <div>
              <h3 className={cn(
                "text-2xl font-black font-headline uppercase tracking-tight mb-2",
                selectedId === null ? "text-[#402D00]" : "text-[#E5E2E1]"
              )}>
                Sem preferência
              </h3>
              <p className={cn(
                "text-xs leading-relaxed font-medium",
                selectedId === null ? "text-[#402D00]/70" : "text-[#D3C5AC]/50"
              )}>
                O primeiro profissional disponível para você.
              </p>
            </div>
          </div>
        </button>

        {staff.map((s) => {
          const isSelected = selectedId === s.id
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={cn(
                "group relative p-8 rounded-[2.5rem] border text-left transition-all duration-500 overflow-hidden",
                isSelected 
                  ? "bg-[#fbbf24] border-transparent shadow-[0_0_40px_rgba(251,191,36,0.2)] scale-[1.02]" 
                  : "bg-[#1C1B1B] border-white/5 hover:border-[#fbbf24]/30 hover:bg-[#201F1F]"
              )}
            >
              <div className="flex flex-col h-full justify-between gap-10">
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "w-20 h-20 rounded-[1.25rem] overflow-hidden border transition-all duration-500 group-hover:scale-110",
                    isSelected ? "border-[#402D00]/20" : "border-white/5"
                  )}>
                    {s.avatar_url ? (
                      <img src={s.avatar_url} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={cn(
                        "w-full h-full flex items-center justify-center bg-[#353534]",
                        isSelected ? "bg-[#402D00] text-[#fbbf24]" : "text-zinc-600"
                      )}>
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div className="text-[#402D00]">
                      <span className="material-symbols-outlined font-black">check_circle</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className={cn(
                    "text-2xl font-black font-headline uppercase tracking-tight mb-1",
                    isSelected ? "text-[#402D00]" : "text-[#E5E2E1]"
                  )}>
                    {s.name}
                  </h3>
                  <p className={cn(
                    "text-xs font-black uppercase tracking-[0.2em]",
                    isSelected ? "text-[#402D00]/60" : "text-[#fbbf24]"
                  )}>
                    {s.role || 'Barbeiro Especialista'}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
