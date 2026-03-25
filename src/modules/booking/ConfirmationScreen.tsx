import { CheckCircle2, Calendar, Clock, Scissors, MapPin, Users2, Sparkles, Home, User, History } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface ConfirmationScreenProps {
  companyName: string
  companyAddress?: string | null
  serviceName: string
  date: string
  startTime: string
  clientName: string
  staffName?: string
  companySlug?: string
}

export function ConfirmationScreen({
  companyName,
  companyAddress,
  serviceName,
  date,
  startTime,
  clientName,
  staffName,
  companySlug,
}: ConfirmationScreenProps) {
  const formatDate = (d: string) => {
    const dateObj = new Date(d + 'T12:00:00')
    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-10 space-y-12">
      {/* Success Animation Container */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-[2.5rem] bg-[#fbbf24] flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.2)] animate-scale-in">
          <CheckCircle2 className="w-16 h-16 text-[#402D00] stroke-[2.5]" />
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-[#0e0e0e] border border-white/5 flex items-center justify-center text-[#fbbf24] animate-bounce-slow delay-300">
           <Sparkles className="w-6 h-6 fill-[#fbbf24]" />
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-4xl lg:text-5xl font-black font-headline text-white uppercase tracking-tighter leading-tight">
          Agendamento <span className="text-[#fbbf24]">Realizado!</span>
        </h2>
        <p className="text-[#D3C5AC] text-lg font-light leading-relaxed">
          Olá <span className="text-white font-bold">{clientName}</span>, seu lugar na <span className="text-white font-bold">{companyName}</span> já está reservado.
        </p>
      </div>

      {/* Ticket Style Details Card */}
      <div className="w-full max-w-sm bg-[#1C1B1B] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-black rounded-full border-r border-white/5 -translate-y-1/2"></div>
        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-black rounded-full border-l border-white/5 -translate-y-1/2"></div>
        
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1rem] bg-[#353534] flex items-center justify-center text-[#fbbf24] flex-shrink-0">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Serviço</p>
              <p className="text-base font-bold text-white uppercase">{serviceName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1rem] bg-[#353534] flex items-center justify-center text-[#fbbf24] flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Data</p>
              <p className="text-base font-bold text-white capitalize">{formatDate(date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1rem] bg-[#353534] flex items-center justify-center text-[#fbbf24] flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Horário</p>
              <p className="text-base font-bold text-white">{startTime}</p>
            </div>
          </div>

          {staffName && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1rem] bg-[#353534] flex items-center justify-center text-[#fbbf24] flex-shrink-0">
                <Users2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Especialista</p>
                <p className="text-base font-bold text-white">{staffName}</p>
              </div>
            </div>
          )}

          {companyAddress && (
            <div className="flex items-center gap-4 pt-4 border-t border-white/[0.03]">
              <div className="w-12 h-12 rounded-[1rem] bg-[#353534]/50 flex items-center justify-center text-zinc-600 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-zinc-500 leading-relaxed">{companyAddress}</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3">
         <a 
           href={companySlug ? `/portal/${companySlug}` : '/portal'}
           className="w-full bg-[#fbbf24] text-[#402D00] py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all active:scale-95"
         >
            <User className="w-4 h-4" /> MEU PORTAL
         </a>
         <a 
           href={window.location.pathname}
           className="w-full bg-white/5 text-zinc-400 hover:text-white py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 border border-white/5 hover:bg-white/10"
         >
            <History className="w-4 h-4" /> NOVO AGENDAMENTO AQUI
         </a>
      </div>
    </div>
  )
}
