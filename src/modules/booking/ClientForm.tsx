import { useState } from 'react'
import { User, AlertCircle, ShieldCheck, Mail, Phone, UserRound, Calendar, Clock, Scissors, LayoutGrid, Timer, DollarSign } from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { Service, Staff } from '@/types'

interface ClientFormProps {
  onSubmit: (data: { name: string; phone: string; email: string; notes: string }) => void
  loading: boolean
  error: string | null
  initialData?: { name: string; phone: string; email: string }
  service: Service | null
  staff: Staff | null
  date: string
  time: string | null
}

function formatPhone(value: string): string {
  if (!value) return ''
  const phone = value.replace(/\D/g, '')
  if (phone.length <= 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export function ClientForm({ onSubmit, loading, error, initialData, service, staff, date, time }: ClientFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [phone, setPhone] = useState(initialData?.phone || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [notes, setNotes] = useState('')
  const [website, setWebsite] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (website) {
      setLocalError('Falha na validação de segurança.')
      return
    }

    if (!name.trim()) {
      setLocalError('Informe como devemos te chamar.')
      return
    }
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setLocalError('Informe um telefone válido para contato.')
      return
    }

    onSubmit({ name: name.trim(), phone, email: email.trim(), notes: notes.trim() })
  }

  const displayError = error || localError

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-4xl lg:text-5xl font-black font-headline text-white uppercase tracking-tighter leading-none">
          Finalize seu <span className="text-[#fbbf24]">agendamento</span>
        </h2>
        <div className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 w-fit mx-auto">
          <ShieldCheck className="w-5 h-5 text-[#fbbf24]" />
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">
            Seus dados estão protegidos e criptografados.
          </p>
        </div>
      </div>

      <div className="bg-[#1C1B1B] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Selection Summary Integrated */}
        <div className="mb-10 bg-black/40 border border-[#fbbf24]/10 rounded-[2rem] p-6 md:p-8 space-y-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#fbbf24]/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-[#fbbf24]/10"></div>
           
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24]">
                    <LayoutGrid className="w-5 h-5" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24]">Resumo da Escolha</p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Confira os detalhes</div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400">
                       <Scissors className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Serviço</p>
                       <p className="text-base font-bold text-white uppercase">{service?.name}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400">
                       <UserRound className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Profissional</p>
                       <p className="text-base font-bold text-white uppercase">{staff?.name || 'Qualquer Profissional'}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400">
                       <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Data e Hora</p>
                       <p className="text-base font-bold text-white uppercase">{date ? new Date(date + 'T12:00:00').toLocaleDateString('pt-BR') : ''} às {time}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-6">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <Timer className="w-3 h-3 text-[#fbbf24]" />
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Duração</p>
                       </div>
                       <p className="text-base font-bold text-white tabular-nums">{service?.duration} min</p>
                    </div>
                    <div className="w-px h-8 bg-white/5"></div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-3 h-3 text-emerald-500" />
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Valor</p>
                       </div>
                       <p className="text-xl font-black text-[#fbbf24] tabular-nums">
                          {service?.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price) : 'R$ 0,00'}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {displayError && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1">{displayError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none">
            <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-[#fbbf24]">
                <UserRound className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como devemos te chamar?"
                className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-14 py-5 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none placeholder-zinc-700 font-bold"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-[#fbbf24]">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-14 py-5 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none placeholder-zinc-700 font-bold tabular-nums"
                required
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-[#fbbf24]">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail (Opcional)"
              className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-14 py-5 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none placeholder-zinc-700 font-bold"
            />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-4">Observações (Opcional)</label>
             <textarea 
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Ex: Alguma preferência ou restrição..."
               rows={3}
               className="w-full bg-[#0e0e0e] border border-white/5 rounded-[1.5rem] px-8 py-5 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none placeholder-zinc-800 resize-none font-medium"
             />
          </div>

          <div className="pt-8 border-t border-white/[0.03] space-y-6">
            <p className="text-[10px] text-zinc-600 text-center uppercase tracking-[0.2em] font-medium leading-relaxed max-w-sm mx-auto">
              Ao confirmar, você concorda com nossos <span className="text-white font-bold">termos de uso</span> e o agendamento.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-full bg-[#fbbf24] text-[#402D00] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#fbbf24]/10 hover:shadow-[#fbbf24]/30 hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processando Reserva...' : 'Confirmar Presença'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
