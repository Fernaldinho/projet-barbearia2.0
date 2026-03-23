import { Clock, Loader2, Sparkles, MessageCircle } from 'lucide-react'
import type { TimeSlot } from '@/lib/availability'
import { cn } from '@/utils/helpers'

interface TimeSelectorProps {
  slots: TimeSlot[]
  selectedTime: string | null
  loading: boolean
  isDayClosed: boolean
  onSelect: (time: string) => void
}

export function TimeSelector({ slots, selectedTime, loading, isDayClosed, onSelect }: TimeSelectorProps) {
  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl lg:text-5xl font-black font-headline text-white uppercase tracking-tighter leading-none">
          Qual <span className="text-[#fbbf24]">horário?</span>
        </h2>
        <div className="flex items-center gap-3 bg-[#fbbf24]/5 border border-[#fbbf24]/10 rounded-2xl px-5 py-3 w-fit">
          <Sparkles className="w-5 h-5 text-[#fbbf24] animate-pulse" />
          <p className="text-[#fbbf24] text-xs font-black uppercase tracking-widest leading-none">
            IA Recomendando os melhores horários para você
          </p>
        </div>
      </div>

      <div className="bg-[#1C1B1B] border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/40 backdrop-blur-sm z-20">
             <div className="w-16 h-16 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
             <p className="text-[#D3C5AC] text-sm font-black uppercase tracking-widest">Consultando Disponibilidade...</p>
          </div>
        ) : isDayClosed ? (
          <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
             <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600">
                <Clock className="w-10 h-10" />
             </div>
             <div>
                <p className="text-xl font-headline font-black text-white uppercase tracking-tight">Estamos Fechados</p>
                <p className="text-zinc-500 text-sm mt-1">Selecione outro dia para continuar sua experiência.</p>
             </div>
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
             <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600">
                <Clock className="w-10 h-10" />
             </div>
             <div>
                <p className="text-xl font-headline font-black text-white uppercase tracking-tight">Ocupação Total</p>
                <p className="text-zinc-500 text-sm mt-1">Todos os horários estão preenchidos para este dia.</p>
             </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pb-8">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot.start_time
                const isAm = parseInt(slot.start_time) < 12

                return (
                  <button
                    key={slot.start_time}
                    onClick={() => onSelect(slot.start_time)}
                    className={cn(
                      "group flex flex-col items-center justify-center py-6 px-4 rounded-[1.5rem] text-sm font-black transition-all duration-500 border overflow-hidden relative",
                      isSelected 
                        ? "bg-[#fbbf24] border-transparent shadow-[0_0_30px_rgba(251,191,36,0.2)] scale-105 z-10" 
                        : "bg-[#0e0e0e] border-white/5 hover:border-[#fbbf24]/30"
                    )}
                  >
                    <span className={cn(
                      "text-xl tracking-tighter",
                      isSelected ? "text-[#402D00]" : "text-[#E5E2E1] group-hover:text-[#fbbf24]"
                    )}>
                      {slot.start_time}
                    </span>
                    <span className={cn(
                      "text-[8px] uppercase tracking-widest mt-1 opacity-50 font-bold",
                      isSelected ? "text-[#402D00]" : "text-white"
                    )}>
                      {isAm ? 'Manhã' : 'Tarde/Noite'}
                    </span>

                    {/* Glossy line */}
                    {isSelected && (
                       <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* WhatsApp Reminder Footer */}
        <div className="mt-8 pt-8 border-t border-white/[0.03] flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
           </div>
           <p className="text-xs text-[#D3C5AC]/60 font-medium leading-relaxed">
             Um lembrete será enviado via <span className="text-white font-bold">WhatsApp</span> 2 horas antes do atendimento.
           </p>
        </div>
      </div>
    </div>
  )
}
