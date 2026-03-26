import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Phone, ArrowRight, Loader2, Scissors, Sparkles, ShieldCheck, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks'
import { generateSlug } from '@/utils/helpers'

export default function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    address: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let baseSlug = generateSlug(formData.companyName)
      let finalSlug = baseSlug
      let retryCount = 0
      let success = false
      let company = null

      // Keep trying with a new slug if it collides (limited retries)
      while (!success && retryCount < 5) {
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert([
            {
              name: formData.companyName,
              slug: finalSlug,
              phone: formData.phone,
              address: formData.address,
              email: user.email, 
              created_by: user.id
            }
          ])
          .select()
          .single()

        if (!companyError) {
          company = newCompany
          success = true
        } else if (companyError.code === '23505' && companyError.message.includes('slug')) {
          // Slug collision! Tack on a random suffix
          const randomSuffix = Math.floor(Math.random() * 1000).toString()
          finalSlug = `${baseSlug}-${randomSuffix}`
          retryCount++
        } else {
          throw companyError
        }
      }

      if (!company) throw new Error('Não foi possível criar sua empresa. Tente usar outro nome.')

      // 2. Create/Update the user profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert([
          {
            id: user.id,
            company_id: company.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
            email: user.email!,
            role: 'owner',
          }
        ], { onConflict: 'id' })

      if (profileError) throw profileError

      // 3. Success!
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error('Onboarding error:', err)
      setError(err.message || 'Erro ao configurar sua empresa. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .noir-bg { background: radial-gradient(circle at 50% -20%, #1a1a1a 0%, #0c0c0c 100%); }
        .amber-glow { box-shadow: 0 0 40px -10px rgba(251, 191, 36, 0.2); }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen noir-bg flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#fbbf24]/5 blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#fbbf24]/5 blur-[100px]" />
        </div>

        <div className="w-full max-w-[440px] relative z-10 space-y-8">
          {/* Logo/Icon Section */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#fbbf24] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              <div className="relative w-20 h-20 bg-[#161616] border border-white/10 rounded-[2rem] flex items-center justify-center animate-float">
                <Scissors className="w-10 h-10 text-[#fbbf24]" />
              </div>
            </div>
            <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-headline font-black text-white tracking-tighter uppercase leading-none">
                    BEM-VINDO AO <span className="text-[#fbbf24]">AGENDAI</span>
                </h1>
                <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Onde a precisão encontra o Estilo</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 p-6 sm:p-8 rounded-[2.5rem] amber-glow relative overflow-hidden">
            {/* Progress indicator */}
            <div className="flex gap-1.5 mb-8">
                <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[#fbbf24]' : 'bg-white/5'}`} />
                <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[#fbbf24]' : 'bg-white/5'}`} />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-bold uppercase tracking-tight text-center animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <p className="text-white text-lg font-headline font-bold tracking-tight mb-4">Primeiro, como se chama seu negócio?</p>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Building2 className="w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24] transition-colors" />
                      </div>
                      <input
                        id="companyName"
                        type="text"
                        required
                        autoFocus
                        className="w-full bg-[#080808] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24]/50 outline-none transition-all placeholder:text-zinc-700 font-medium"
                        placeholder="Ex: Precision Barber Shop"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => formData.companyName && setStep(2)}
                    disabled={!formData.companyName}
                    className="w-full py-4 bg-[#fbbf24] text-[#402d00] hover:bg-[#fbbf24]/90 rounded-2xl font-headline font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#fbbf24]/10 flex items-center justify-center gap-2 group disabled:opacity-30 disabled:grayscale"
                  >
                    CONTINUAR
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="space-y-5 animate-fade-in">
                   <div className="space-y-4">
                    <p className="text-white text-lg font-headline font-bold tracking-tight">Informações de Contato</p>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Telefone Comercial</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Phone className="w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24] transition-colors" />
                          </div>
                          <input
                            id="phone"
                            type="tel"
                            required
                            autoFocus
                            className="w-full bg-[#080808] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24]/50 outline-none transition-all placeholder:text-zinc-700 font-medium"
                            placeholder="(11) 99999-9999"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Endereço da Barbearia</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <MapPin className="w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24] transition-colors" />
                          </div>
                          <input
                            id="address"
                            type="text"
                            required
                            className="w-full bg-[#080808] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24]/50 outline-none transition-all placeholder:text-zinc-700 font-medium"
                            placeholder="Rua Exemplo, 123 - Centro"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          />
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-4 bg-white/5 text-zinc-500 hover:text-white rounded-2xl font-headline font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Voltar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !formData.phone || !formData.address}
                        className="flex-1 py-4 bg-[#fbbf24] text-[#402d00] hover:bg-[#fbbf24]/90 rounded-2xl font-headline font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#fbbf24]/10 flex items-center justify-center gap-2 group disabled:opacity-30"
                    >
                        {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                        <>
                            Finalizar Setup
                            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </>
                        )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Social Proof/Trust */}
          <div className="flex items-center justify-center gap-6 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-1.5 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <ShieldCheck className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Seguro</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5 opacity-40">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Setup em 30 Segundos</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-12 pb-6">
            <p className="text-zinc-700 text-[8px] font-black uppercase tracking-[0.4em] text-center">
                Desenvolvemos o futuro do Agendamento • © {new Date().getFullYear()} Precision Noir
            </p>
        </div>
      </div>
    </>
  )
}
