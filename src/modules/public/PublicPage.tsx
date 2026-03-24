import { Link as LinkIcon, Palette, Clock, Smartphone, Laptop, CloudUpload, CheckCircle, ExternalLink, MapPin, Copy } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { cn } from '@/utils/helpers'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export function PublicPage() {
  const { company } = useCompany()
  const [loading, setLoading] = useState(false)
  
  const generatedSlug = company 
    ? company.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : 'minha-barbearia'

  const copyBookingLink = () => {
    const link = `${window.location.origin}/book/${generatedSlug}`
    navigator.clipboard.writeText(link)
    toast.success('Link copiado!')
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !company) return

    try {
      setLoading(true)
      const fileExt = file.name.split('.').pop()
      const filePath = `company-banners/${company.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('companies')
        .update({ banner_url: publicUrl })
        .eq('id', company.id)

      if (updateError) throw updateError
      
      toast.success('Banner atualizado com sucesso!')
      window.location.reload() // Recarrega para refletir a mudança via Contexto
    } catch (err) {
      console.error(err)
      toast.error('Erro ao subir banner. Verifique as permissões de Bucket no Supabase.')
    } finally {
      setLoading(false)
    }
  }

  const defaultBanner = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1200"
  const bannerToDisplay = company?.banner_url || defaultBanner

  return (
    <div className="animate-fade-in pb-20 space-y-16 mt-8">
      {/* Search Header Style (Consistent) */}
      <div className="flex items-center px-4 lg:px-0 mb-12">
        <div className="relative flex items-center group flex-1 max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#fbbf24] transition-colors">search</span>
          <input 
            className="w-full bg-[#0e0e0e] border-none py-3.5 pl-12 pr-6 rounded-full text-sm focus:ring-1 focus:ring-[#fbbf24] placeholder:text-zinc-600 transition-all outline-none text-[#E5E2E1]" 
            placeholder="Pesquisar..." 
            type="text"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="text-[#fbbf24] text-xs font-black uppercase tracking-[0.3em] mb-4 block">Personalização</span>
            <h1 className="text-6xl font-headline font-black text-[#E5E2E1] tracking-tighter uppercase leading-none">Página Pública</h1>
          </div>
          <a 
            href={`/book/${generatedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fbbf24] text-[#402D00] px-10 py-5 rounded-full font-black text-sm flex items-center gap-3 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all active:scale-95 group shadow-xl shadow-[#fbbf24]/10"
          >
            VISUALIZAR PÁGINA
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Settings Column */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* URL Configuration */}
            <section className="bg-[#1C1B1B] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-[#fbbf24]/10 rounded-2xl shadow-inner text-[#fbbf24]">
                  <LinkIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black font-headline text-white uppercase tracking-tighter">Link da Agenda</h2>
              </div>
              <div className="space-y-6">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">URL Gerada Automaticamente</label>
                <div className="flex flex-col sm:flex-row gap-3">
                   <div className="flex group flex-1 opacity-80">
                      <span className="bg-[#0e0e0e] px-6 py-5 rounded-l-2xl text-zinc-600 border border-white/5 border-r-0 text-sm font-black flex items-center">/book/</span>
                      <input 
                        className="flex-1 bg-[#0e0e0e] border border-white/5 rounded-r-2xl py-5 px-6 text-zinc-400 font-black cursor-not-allowed outline-none text-sm" 
                        type="text" 
                        value={generatedSlug}
                        readOnly
                        disabled
                      />
                   </div>
                   <button 
                     onClick={copyBookingLink}
                     className="bg-white/5 border border-white/5 text-zinc-400 hover:text-[#fbbf24] hover:border-[#fbbf24]/20 px-6 py-5 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                   >
                      <Copy className="w-4 h-4" /> Copiar Link
                   </button>
                </div>
                <p className="text-xs text-zinc-600 font-medium ml-1">Este link é gerado automaticamente com base no nome do seu estabelecimento. <br/> Seu link oficial: <span className="text-[#fbbf24]/60">{window.location.origin}/book/{generatedSlug}</span></p>
              </div>
            </section>

            {/* Appearance and Identity */}
            <section className="bg-[#1C1B1B] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-[#fbbf24]/10 rounded-2xl shadow-inner text-[#fbbf24]">
                  <Palette className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black font-headline text-white uppercase tracking-tighter">Aparência e Identidade</h2>
              </div>
              <div className="space-y-10">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-6 ml-1">Banner de Capa (Noir Style)</label>
                  <label 
                    className="relative h-64 rounded-[2rem] overflow-hidden group cursor-pointer border-2 border-dashed border-white/5 hover:border-[#fbbf24]/30 transition-all shadow-inner block"
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleBannerUpload}
                      disabled={loading}
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                      <CloudUpload className={cn("text-[#fbbf24] w-10 h-10 mb-4", loading && "animate-bounce")} />
                      <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                        {loading ? 'ENVIANDO...' : 'ALTERAR BANNER'}
                      </span>
                    </div>
                    <img 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-all duration-1000 scale-105 group-hover:scale-110" 
                      src={bannerToDisplay} 
                    />
                  </label>
                </div>

              </div>
            </section>

            {/* Business Hours */}
            <section className="bg-[#1C1B1B] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#fbbf24]/10 rounded-2xl shadow-inner text-[#fbbf24]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black font-headline text-white uppercase tracking-tighter">Horário de Atendimento</h2>
                </div>
                <button className="text-[#fbbf24] text-[10px] font-black uppercase tracking-widest hover:underline py-2 px-4 rounded-xl hover:bg-[#fbbf24]/5 transition-all">CONFIGURAÇÃO EM MASSA</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {/* Sunday Off */}
                <div className="flex items-center justify-between p-6 bg-[#0e0e0e] rounded-3xl opacity-50 border border-white/[0.02]">
                  <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">Domingo</span>
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600">F E C H A D O</span>
                  <div className="w-12 h-6 bg-zinc-900 rounded-full relative shadow-inner">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-700 rounded-full"></div>
                  </div>
                </div>
                {/* Weekdays */}
                <div className="flex items-center justify-between p-6 bg-[#0e0e0e] rounded-3xl border border-[#fbbf24]/10 group hover:border-[#fbbf24]/30 transition-all shadow-xl">
                  <span className="text-sm font-black text-white uppercase tracking-widest">Seg - Sex</span>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-black px-6 py-3 bg-[#1C1B1B] rounded-2xl text-[#fbbf24] border border-[#fbbf24]/10 shadow-inner">09:00</span>
                    <span className="text-zinc-700 font-black text-[10px]">A S</span>
                    <span className="text-sm font-black px-6 py-3 bg-[#1C1B1B] rounded-2xl text-[#fbbf24] border border-[#fbbf24]/10 shadow-inner">20:00</span>
                  </div>
                  <div className="w-12 h-6 bg-[#fbbf24]/20 rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-[#fbbf24] rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="bg-[#0e0e0e] border border-white/10 rounded-[3rem] p-6 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden scale-[0.95] origin-top">
              {/* Mobile Shell Mockup */}
              <div className="bg-[#131313] h-[750px] rounded-[2.5rem] overflow-hidden flex flex-col relative border border-white/5">
                {/* Header Mockup */}
                <div className="relative h-60 shrink-0">
                  <img 
                    className="w-full h-full object-cover grayscale-50 opacity-60" 
                    src={bannerToDisplay} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-8 right-8">
                    <h3 className="text-3xl font-headline font-black text-white tracking-tighter uppercase leading-none">{company?.name || 'Sua Barbearia'}</h3>
                    <p className="text-[10px] text-[#fbbf24] font-black uppercase tracking-widest mt-3 flex items-center gap-2">
                       <MapPin className="w-3 h-3" />
                       {company?.address || 'ENDEREÇO NÃO CONFIGURADO'}
                    </p>
                  </div>
                </div>
                {/* Content Mockup */}
                <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scrollbar-hide">
                  <section>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#fbbf24] font-black mb-6">NOSSOS SERVIÇOS</h4>
                    <div className="space-y-4">
                      <div className="text-center py-10 bg-[#1C1B1B] rounded-3xl border border-dashed border-white/5">
                          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Seus serviços aparecerão aqui</p>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#fbbf24] font-black mb-6">PROFISSIONAIS</h4>
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                       <div className="text-center w-full py-4 border border-dashed border-white/5 rounded-2xl">
                           <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Sua equipe aqui</p>
                       </div>
                    </div>
                  </section>
                </div>
                {/* Floating Brand Badge */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-3xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                  <span className="text-[10px] tracking-tight font-bold text-zinc-500">Powered by</span>
                  <span className="text-xs font-headline font-black text-[#fbbf24] uppercase tracking-tighter">AgendaAI</span>
                </div>
              </div>
              {/* Preview Caption */}
              <div className="mt-10 px-4 flex justify-between items-center bg-[#131313] p-6 rounded-[2rem] border border-white/5">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">VISUALIZAÇÃO EM TEMPO REAL</span>
                <div className="flex gap-6">
                  <Smartphone className="w-5 h-5 text-[#fbbf24]" />
                  <Laptop className="w-5 h-5 text-zinc-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-0 mt-16">
        <div className="bg-[#1C1B1B]/80 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            <p className="text-sm font-black text-white uppercase tracking-tighter">Alterações salvas automaticamente</p>
          </div>
          <div className="flex gap-6">
            <button className="px-10 py-5 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all shadow-lg active:scale-95">DESCARTAR</button>
            <button 
              className="px-16 py-5 rounded-full bg-[#fbbf24] text-[#402D00] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#fbbf24]/20 hover:shadow-[#fbbf24]/40 transition-all active:scale-95"
            >
              SALVAR ALTERAÇÕES
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
