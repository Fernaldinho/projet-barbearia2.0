import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Phone, MapPin, Loader2, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks'
import { generateSlug } from '@/utils/helpers'

export default function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    street: '',
    number: '',
    neighborhood: '',
    zipCode: '',
    city: '',
    state: 'SP',
  })

  useEffect(() => {
    if (user?.user_metadata?.company_name && !formData.companyName) {
      setFormData(prev => ({ ...prev, companyName: user.user_metadata.company_name }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // 1. Check for existing company for this user
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('*')
        .eq('created_by', user.id)
        .maybeSingle()

      // 2. Determine unique slug
      let finalSlug = generateSlug(formData.companyName)
      
      // If user changed the name or doesn't have a company yet, check for collisions
      if (!existingCompany || generateSlug(existingCompany.name) !== finalSlug) {
        const { data: collision } = await supabase
          .from('companies')
          .select('id')
          .eq('slug', finalSlug)
          .maybeSingle()
        
        if (collision && collision.id !== existingCompany?.id) {
          // Add a short random suffix if taken by someone else
          finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`
        }
      } else {
        // Reuse original slug if name hasn't changed meaningfully
        finalSlug = existingCompany.slug
      }
      
      // 3. Format complete address
      const fullAddress = `${formData.street}, ${formData.number} - ${formData.neighborhood}, ${formData.city} - ${formData.state}, ${formData.zipCode}`
      
      let companyId = existingCompany?.id

      if (existingCompany) {
        // Update existing
        const { error: updateError } = await supabase
          .from('companies')
          .update({
            name: formData.companyName,
            slug: finalSlug,
            phone: formData.phone,
            address: fullAddress,
          })
          .eq('id', existingCompany.id)
        
        if (updateError) throw updateError
      } else {
        // Create new
        const { data: newCompany, error: createError } = await supabase
          .from('companies')
          .insert([
            {
              name: formData.companyName,
              slug: finalSlug,
              phone: formData.phone,
              address: fullAddress,
              created_by: user.id,
              email: user.email
            }
          ])
          .select()
          .single()

        if (createError) throw createError
        companyId = newCompany.id
      }

      // 4. Upsert the user profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert([
          {
            id: user.id,
            company_id: companyId,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
            email: user.email!,
            role: 'owner',
          }
        ])

      if (profileError) throw profileError

      // 5. Success! Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error('Onboarding error:', err)
      setError(err.message || 'Erro ao configurar sua empresa. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-body selection:bg-[#fbbf24] selection:text-[#131313] overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-[#131313]/80"></div>
      </div>

      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-20 bg-[#131313]/40 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-headline font-bold text-[#fbbf24] tracking-tighter uppercase">agendai</h1>
        </div>
      </header>

      <main className="relative z-10 min-h-screen w-full flex items-center justify-center py-24 px-4 md:px-8">
        <section className="w-full max-w-2xl bg-[#1c1b1b] p-10 md:p-14 border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#fbbf24]/10 blur-[80px] rounded-full group-hover:bg-[#fbbf24]/15 transition-all duration-700"></div>
          
          <div className="space-y-4 mb-12 relative z-10">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white leading-tight tracking-tight uppercase">
              Configuração <br />
              <span className="text-[#fbbf24]">Essencial</span>
            </h2>
            <p className="text-[#d3c5ac] text-lg font-body max-w-md leading-relaxed">
              Finalize os detalhes técnicos para abrir sua agenda no padrão <span className="text-white font-medium italic">Precision Noir</span>.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-400 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
            {/* Nome da Barbearia */}
            <div className="md:col-span-6 flex flex-col gap-2.5">
              <label className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[#d3c5ac]/60 ml-1">Nome do Estabelecimento</label>
              <div className="relative group/field">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d3c5ac]/30 group-focus-within/field:text-[#fbbf24] transition-colors" />
                <input 
                  required
                  type="text"
                  placeholder="Ex: Barber Shop Precision"
                  className="w-full bg-[#0e0e0e] border border-white/5 focus:border-[#fbbf24]/50 focus:ring-4 focus:ring-[#fbbf24]/5 outline-none pl-14 pr-6 py-5 text-white placeholder:text-white/10 rounded-2xl transition-all duration-300"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="md:col-span-6 flex flex-col gap-2.5">
              <label className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[#d3c5ac]/60 ml-1">Contato Profissional</label>
              <div className="relative group/field">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d3c5ac]/30 group-focus-within/field:text-[#fbbf24] transition-colors" />
                <input 
                  required
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="w-full bg-[#0e0e0e] border border-white/5 focus:border-[#fbbf24]/50 focus:ring-4 focus:ring-[#fbbf24]/5 outline-none pl-14 pr-6 py-5 text-white placeholder:text-white/10 rounded-2xl transition-all duration-300"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Endereço - Rua */}
            <div className="md:col-span-4 flex flex-col gap-2.5">
              <label className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[#d3c5ac]/60 ml-1">Logradouro / Rua</label>
              <div className="relative group/field">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d3c5ac]/30 group-focus-within/field:text-[#fbbf24] transition-colors" />
                <input 
                  required
                  type="text"
                  placeholder="Ex: Av. Paulista"
                  className="w-full bg-[#0e0e0e] border border-white/5 focus:border-[#fbbf24]/50 focus:ring-4 focus:ring-[#fbbf24]/5 outline-none pl-14 pr-6 py-5 text-white placeholder:text-white/10 rounded-2xl transition-all duration-300"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>
            </div>

            {/* Número */}
            <div className="md:col-span-2 flex flex-col gap-2.5">
              <label className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[#d3c5ac]/60 ml-1">№</label>
              <input 
                required
                type="text"
                placeholder="123"
                className="w-full bg-[#0e0e0e] border border-white/5 focus:border-[#fbbf24]/50 focus:ring-4 focus:ring-[#fbbf24]/5 outline-none px-6 py-5 text-white placeholder:text-white/10 rounded-2xl transition-all duration-300"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              />
            </div>

            {/* Bairro */}
            <div className="md:col-span-3 flex flex-col gap-2.5">
              <label className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[#d3c5ac]/60 ml-1">Bairro</label>
              <input 
                required
                type="text"
                placeholder="Centro"
                className="w-full bg-[#0e0e0e] border border-white/5 focus:border-[#fbbf24]/50 focus:ring-4 focus:ring-[#fbbf24]/5 outline-none px-6 py-5 text-white placeholder:text-white/10 rounded-2xl transition-all duration-300"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              />
            </div>

            {/* CEP */}
            <div className="md:col-span-3 flex flex-col gap-2.5">
              <label className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[#d3c5ac]/60 ml-1">CEP</label>
              <input 
                required
                type="text"
                placeholder="00000-000"
                className="w-full bg-[#0e0e0e] border border-white/5 focus:border-[#fbbf24]/50 focus:ring-4 focus:ring-[#fbbf24]/5 outline-none px-6 py-5 text-white placeholder:text-white/10 rounded-2xl transition-all duration-300"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>

            {/* Cidade */}
            <div className="md:col-span-4 flex flex-col gap-2.5">
              <label className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[#d3c5ac]/60 ml-1">Cidade</label>
              <input 
                required
                type="text"
                placeholder="São Paulo"
                className="w-full bg-[#0e0e0e] border border-white/5 focus:border-[#fbbf24]/50 focus:ring-4 focus:ring-[#fbbf24]/5 outline-none px-6 py-5 text-white placeholder:text-white/10 rounded-2xl transition-all duration-300"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            {/* Estado */}
            <div className="md:col-span-2 flex flex-col gap-2.5">
              <label className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[#d3c5ac]/60 ml-1">UF</label>
              <div className="relative">
                <select 
                  className="w-full bg-[#0e0e0e] border border-white/5 focus:border-[#fbbf24]/50 focus:ring-4 focus:ring-[#fbbf24]/5 outline-none px-6 py-5 text-white appearance-none rounded-2xl transition-all duration-300"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                  <option value="RS">RS</option>
                  <option value="PR">PR</option>
                  <option value="SC">SC</option>
                  <option value="ES">ES</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#d3c5ac]/40">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="md:col-span-6 pt-10">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-[#402d00] font-headline font-bold uppercase tracking-[0.2em] text-sm md:text-base rounded-full shadow-lg shadow-[#fbbf24]/10 hover:shadow-[#fbbf24]/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Finalizar Configuração
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="mt-12 flex items-center justify-center gap-4 opacity-30 group-hover:opacity-50 transition-opacity">
            <div className="h-[1px] w-12 bg-[#fbbf24]"></div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#d3c5ac]">Precision System</span>
            <div className="h-[1px] w-12 bg-[#fbbf24]"></div>
          </div>
        </section>
      </main>

      {/* Decorative Branding */}
      <div className="fixed bottom-12 right-12 pointer-events-none select-none z-0 opacity-[0.03]">
        <h3 className="text-[12rem] font-headline font-bold text-white tracking-tighter leading-none">AI</h3>
      </div>
    </div>

  )
}
