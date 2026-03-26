import { Link as LinkIcon, Palette, Clock, Smartphone, Laptop, CloudUpload, CheckCircle, ExternalLink, MapPin, Copy, Scissors } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { cn } from '@/utils/helpers'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export function PublicPage() {
  const { company } = useCompany()
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
  const [previewServices, setPreviewServices] = useState<any[]>([])
  const [previewStaff, setPreviewStaff] = useState<any[]>([])

  // Load some real data for the preview
  useEffect(() => {
    if (company?.id) {
       supabase.from('services').select('*').eq('company_id', company.id).limit(2).then(({data}) => {
         if (data) setPreviewServices(data)
       })
       supabase.from('staff').select('*').eq('company_id', company.id).limit(3).then(({data}) => {
         if (data) setPreviewStaff(data)
       })
    }
  }, [company?.id])
  
  const generatedSlug = company 
    ? company.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : 'minha-barbearia'

  const copyPortalLink = () => {
    const link = `${window.location.origin}/portal/${generatedSlug}`
    navigator.clipboard.writeText(link)
    toast.success('Link do portal copiado!')
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
      
      // We need to refresh the context so the display updates
      // Instead of reload, we can call refreshCompany if we take it from useCompany
      toast.success('Banner atualizado com sucesso!')
      window.location.reload() 
    } catch (err) {
      console.error(err)
      toast.error('Erro ao subir banner.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !company) return

    try {
      setLoading(true)
      const fileExt = file.name.split('.').pop()
      const filePath = `company-logos/${company.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('companies')
        .update({ logo_url: publicUrl })
        .eq('id', company.id)

      if (updateError) throw updateError
      
      toast.success('Logo atualizada com sucesso!')
      window.location.reload()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao subir logo.')
    } finally {
      setLoading(false)
    }
  }

  const defaultBanner = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1200"
  const bannerToDisplay = company?.banner_url || defaultBanner

  return (
    <div className="animate-fade-in pb-10 space-y-4 sm:space-y-16 mt-4 sm:mt-8">
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

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-0">
        <header className="mb-8 sm:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-8">
          <div>
            <span className="text-[#fbbf24] text-[8px] sm:text-xs font-black uppercase tracking-[0.3em] mb-2 sm:4 block">Personalização</span>
            <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-black text-[#E5E2E1] tracking-tighter uppercase leading-none">Página Pública</h1>
          </div>
          <a 
            href={`/portal/${generatedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#fbbf24] text-[#402D00] px-6 sm:px-10 py-3 sm:py-5 rounded-full font-black text-[10px] sm:text-sm flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all active:scale-95 group shadow-xl shadow-[#fbbf24]/10"
          >
            VISUALIZAR PÁGINA
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-16 items-start">
          {/* Settings Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-12">
            
            {/* URL Configuration */}
            <section className="bg-[#1C1B1B] p-4 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                <div className="p-2 sm:p-3 bg-[#fbbf24]/10 rounded-xl sm:rounded-2xl shadow-inner text-[#fbbf24]">
                  <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-lg sm:text-2xl font-black font-headline text-white uppercase tracking-tighter">Links Públicos</h2>
              </div>
              
              <div className="space-y-6 sm:space-y-10">
                {/* Portal Link */}
                <div className="space-y-4 sm:space-y-6">
                  <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Link do Portal do Cliente</label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                     <div className="flex group flex-1 opacity-80 shrink-0">
                        <span className="bg-[#0e0e0e] px-3 sm:px-6 py-3 sm:py-5 rounded-l-xl sm:rounded-l-2xl text-zinc-600 border border-white/5 border-r-0 text-[10px] sm:text-sm font-black flex items-center shrink-0">/p/</span>
                        <input 
                          className="w-full bg-[#0e0e0e] border border-white/5 rounded-r-xl sm:rounded-r-2xl py-3 sm:py-5 px-3 sm:px-6 text-zinc-400 font-black cursor-not-allowed outline-none text-[10px] sm:text-sm" 
                          type="text" 
                          value={generatedSlug}
                          readOnly
                          disabled
                        />
                     </div>
                     <button 
                       onClick={copyPortalLink}
                       className="bg-white/5 border border-white/5 text-zinc-400 hover:text-[#fbbf24] hover:border-[#fbbf24]/20 px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest"
                     >
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Copiar
                     </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Appearance and Identity */}
            <section className="bg-[#1C1B1B] p-4 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                <div className="p-2 sm:p-3 bg-[#fbbf24]/10 rounded-xl sm:rounded-2xl shadow-inner text-[#fbbf24]">
                  <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-lg sm:text-2xl font-black font-headline text-white uppercase tracking-tighter">Aparência</h2>
              </div>
              <div className="space-y-6 sm:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
                  <div className="md:col-span-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4 sm:mb-6 ml-1">Banner de Capa</label>
                    <label 
                      className="relative h-40 sm:h-64 rounded-2xl sm:rounded-[2rem] overflow-hidden group cursor-pointer border-2 border-dashed border-white/5 hover:border-[#fbbf24]/30 transition-all shadow-inner block"
                    >
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleBannerUpload}
                        disabled={loading}
                      />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                        <CloudUpload className={cn("text-[#fbbf24] w-6 h-6 sm:w-10 sm:h-10 mb-2 sm:mb-4", loading && "animate-bounce")} />
                        <span className="text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
                          {loading ? 'ENVIANDO...' : 'ALTERAR'}
                        </span>
                      </div>
                      <img 
                        className="w-full h-full object-cover group-hover:opacity-80 transition-all duration-1000 scale-100 group-hover:scale-110" 
                        src={bannerToDisplay} 
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4 sm:mb-6 ml-1">Logo</label>
                    <label 
                      className="relative h-40 sm:h-64 rounded-2xl sm:rounded-[2rem] overflow-hidden group cursor-pointer border-2 border-dashed border-white/5 hover:border-[#fbbf24]/30 transition-all shadow-inner block"
                    >
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleLogoUpload}
                        disabled={loading}
                      />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                        <CloudUpload className={cn("text-[#fbbf24] w-6 h-6 sm:w-10 sm:h-10 mb-2 sm:mb-4", loading && "animate-bounce")} />
                        <span className="text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
                          {loading ? 'LOGO...' : 'ALTERAR'}
                        </span>
                      </div>
                      <div className="w-full h-full flex items-center justify-center bg-[#0e0e0e] p-4 sm:p-10">
                        {company?.logo_url ? (
                          <img 
                            className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                            src={company.logo_url} 
                          />
                        ) : (
                          <Scissors className="w-8 h-8 sm:w-16 sm:h-16 text-zinc-800" />
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Business Hours */}
            <section className="bg-[#1C1B1B] p-4 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-[#fbbf24]/10 rounded-xl sm:rounded-2xl shadow-inner text-[#fbbf24]">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black font-headline text-white uppercase tracking-tighter">Horário</h2>
                </div>
                <button className="text-[#fbbf24] text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:underline py-2 px-3 sm:px-4 rounded-xl hover:bg-[#fbbf24]/5 transition-all text-left">CONFIGURAÇÃO</button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:gap-4">
                {/* Sunday Off */}
                <div className="flex items-center justify-between p-3 sm:p-6 bg-[#0e0e0e] rounded-2xl sm:rounded-3xl opacity-50 border border-white/[0.02]">
                  <span className="text-xs sm:text-sm font-black text-zinc-400 uppercase tracking-widest">Dom</span>
                  <span className="text-[8px] sm:text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600">F E C H A D O</span>
                  <div className="w-8 sm:w-12 h-4 sm:h-6 bg-zinc-900 rounded-full relative shadow-inner">
                    <div className="absolute left-1 top-1 w-2 sm:w-4 h-2 sm:h-4 bg-zinc-700 rounded-full"></div>
                  </div>
                </div>
                {/* Weekdays */}
                <div className="flex items-center justify-between p-3 sm:p-6 bg-[#0e0e0e] rounded-2xl sm:rounded-3xl border border-[#fbbf24]/10 group hover:border-[#fbbf24]/30 transition-all shadow-xl">
                  <span className="text-xs sm:text-sm font-black text-white uppercase tracking-widest">Seg-Sex</span>
                  <div className="flex items-center gap-2 sm:gap-6">
                    <span className="text-[10px] sm:text-sm font-black px-2 sm:px-6 py-1.5 sm:py-3 bg-[#1C1B1B] rounded-lg sm:rounded-2xl text-[#fbbf24] border border-[#fbbf24]/10 shadow-inner">09:00</span>
                    <span className="text-zinc-700 font-black text-[8px] sm:text-[10px]">-</span>
                    <span className="text-[10px] sm:text-sm font-black px-2 sm:px-6 py-1.5 sm:py-3 bg-[#1C1B1B] rounded-lg sm:rounded-2xl text-[#fbbf24] border border-[#fbbf24]/10 shadow-inner">20:00</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-5 sticky top-32">
            <div className={cn(
              "bg-[#0e0e0e] border border-white/10 rounded-[3rem] p-4 sm:p-6 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 origin-top mx-auto",
              previewMode === 'mobile' ? "w-full max-w-[400px]" : "w-full max-w-5xl h-fit overflow-visible"
            )}>
              {/* Device Shell Mockup */}
              <div className={cn(
                "bg-[#131313] rounded-[2.5rem] overflow-hidden flex flex-col relative border border-white/5 transition-all duration-500 shadow-2xl shadow-black",
                previewMode === 'mobile' ? "h-[700px]" : "h-auto min-h-[600px]"
              )}>
                {/* Header Mockup */}
                <div className={cn(
                  "relative shrink-0 transition-all duration-500",
                  previewMode === 'mobile' ? "h-48 sm:h-60" : "h-40 sm:h-48"
                )}>
                  <img 
                    className="w-full h-full object-cover grayscale-50 opacity-60" 
                    src={bannerToDisplay} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-8 right-8">
                    <h3 className="text-3xl font-headline font-black text-white tracking-tighter uppercase leading-none">{company?.name || 'Sua Barbearia'}</h3>
                    <p className="text-[11px] text-[#fbbf24] font-black uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                       <MapPin className="w-3.5 h-3.5" />
                       {company?.address || 'ENDEREÇO NÃO CONFIGURADO'}
                    </p>
                    <button 
                      className="mt-6 bg-[#fbbf24] text-[#402D00] px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#fbbf24]/10"
                    >
                       Faça Novo Agendamento
                    </button>
                  </div>
                </div>
                {/* Content Mockup */}
                <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scrollbar-hide">
                  <section>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#fbbf24] font-black mb-6">NOSSOS SERVIÇOS</h4>
                    <div className="space-y-4">
                      {previewServices.length > 0 ? (
                        previewServices.map(s => (
                          <div key={s.id} className="flex justify-between items-center p-4 bg-[#1C1B1B] rounded-2xl border border-white/5">
                            <div>
                               <p className="text-xs font-black text-white uppercase">{s.name}</p>
                               <p className="text-[10px] text-zinc-600 uppercase">{s.duration} min</p>
                            </div>
                            <span className="text-xs font-black text-[#fbbf24]">R$ {s.price}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 bg-[#1C1B1B] rounded-3xl border border-dashed border-white/5">
                           <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Seus serviços aparecerão aqui</p>
                        </div>
                      )}
                    </div>
                  </section>
                  <section>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#fbbf24] font-black mb-6">PROFISSIONAIS</h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                       {previewStaff.length > 0 ? (
                         previewStaff.map(st => (
                           <div key={st.id} className="shrink-0 text-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-[#fbbf24]/20 overflow-hidden">
                                 {st.avatar_url && <img src={st.avatar_url} className="w-full h-full object-cover" />}
                              </div>
                              <p className="text-[8px] font-black text-white uppercase tracking-tighter">{st.name.split(' ')[0]}</p>
                           </div>
                         ))
                       ) : (
                         <div className="text-center w-full py-4 border border-dashed border-white/5 rounded-2xl">
                            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Sua equipe aqui</p>
                         </div>
                       )}
                    </div>
                  </section>
                </div>
                {/* Floating Brand Badge */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-3xl px-6 py-2 rounded-full border border-white/10 shadow-2xl">
                  <span className="text-[8px] tracking-tight font-bold text-zinc-500">Powered by</span>
                  <span className="text-[10px] font-headline font-black text-[#fbbf24] uppercase tracking-tighter">AgendaAI</span>
                </div>
              </div>
              {/* Preview Caption / Switcher */}
              <div className="mt-6 px-4 flex justify-between items-center bg-[#131313] p-4 rounded-[1.5rem] border border-white/5">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">VISUALIZAÇÃO EM TEMPO REAL</span>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPreviewMode('mobile')}
                    className={cn("p-2 rounded-xl transition-all", previewMode === 'mobile' ? "bg-[#fbbf24]/20 text-[#fbbf24]" : "text-zinc-700 hover:text-zinc-500")}
                  >
                    <Smartphone className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setPreviewMode('desktop')}
                    className={cn("p-2 rounded-xl transition-all", previewMode === 'desktop' ? "bg-[#fbbf24]/20 text-[#fbbf24]" : "text-zinc-700 hover:text-zinc-500")}
                  >
                    <Laptop className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-0 mt-8 sm:mt-16">
        <div className="bg-[#1C1B1B]/80 backdrop-blur-2xl p-4 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 shadow-2xl">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            <p className="text-[10px] sm:text-sm font-black text-white uppercase tracking-tighter text-center">Salvo automaticamente</p>
          </div>
          <div className="flex gap-3 sm:gap-6 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 sm:px-16 py-3 sm:py-5 rounded-full bg-[#fbbf24] text-[#402D00] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#fbbf24]/20 transition-all active:scale-95">
              SALVAR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
