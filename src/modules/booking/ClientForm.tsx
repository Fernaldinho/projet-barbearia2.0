import { useState } from 'react'
import { User, AlertCircle, ShieldCheck, Mail, Phone, UserRound } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface ClientFormProps {
  onSubmit: (data: { name: string; phone: string; email: string }) => void
  loading: boolean
  error: string | null
}

function formatPhone(value: string): string {
  if (!value) return ''
  const phone = value.replace(/\D/g, '')
  if (phone.length <= 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export function ClientForm({ onSubmit, loading, error }: ClientFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!name.trim()) {
      setLocalError('Informe seu nome completo.')
      return
    }
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setLocalError('Informe um telefone válido para contato.')
      return
    }

    onSubmit({ name: name.trim(), phone, email: email.trim() })
  }

  const displayError = error || localError

  return (
    <div className="animate-fade-in space-y-12 pb-10">
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-4xl lg:text-5xl font-black font-headline text-white uppercase tracking-tighter leading-none">
          Finalize seu <span className="text-[#fbbf24]">agendamento</span>
        </h2>
        <div className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 w-fit mx-auto">
          <ShieldCheck className="w-5 h-5 text-[#fbbf24]" />
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest leading-none">
            Seus dados estão protegidos e criptografados.
          </p>
        </div>
      </div>

      <div className="bg-[#1C1B1B] border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
        {displayError && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1">{displayError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-3 p-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-4">Nome Completo</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-[#fbbf24]">
                  <UserRound className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como devemos te chamar?"
                  className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-14 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none placeholder-zinc-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 p-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-4">Telefone Celular</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-[#fbbf24]">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-14 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none placeholder-zinc-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 p-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-4">Seu Melhor E-mail</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-[#fbbf24]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Para enviarmos o comprovante"
                  className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-14 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none placeholder-zinc-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.03] space-y-6">
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-medium leading-relaxed">
              Ao confirmar, você concorda com nossos <span className="text-white font-bold">termos de uso</span> e o tratamento de seus dados para fins de agendamento.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-full bg-[#fbbf24] text-[#402D00] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#fbbf24]/10 hover:shadow-[#fbbf24]/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processando Reserva...' : 'Confirmar Presença'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
