import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/helpers'
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Lock, 
  Baby, 
  Scissors, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  History,
  AlertCircle,
  Sparkles,
  Settings,
  X,
  Phone,
  Star
} from 'lucide-react'
import { getClientAppointmentsForPortal } from '../clients/clients.api'
import { supabase } from '@/lib/supabase'

export function ClientPortal() {
  const { user, login, logout, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()

  // Auth State
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data State
  const [appointments, setAppointments] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  const [companyContext, setCompanyContext] = useState<any>(null)

  useEffect(() => {
    if (slug) {
      supabase.from('companies').select('name, logo_url').eq('slug', slug).single().then(({data}) => {
        if (data) setCompanyContext(data)
      })
    }
  }, [slug])

  const [showSettings, setShowSettings] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileBirthDate, setProfileBirthDate] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)

  // Review State
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [showReviewThanks, setShowReviewThanks] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.email) loadAppointments(user.email, user.user_metadata?.phone)
      setProfileName(user.user_metadata?.full_name || '')
      setProfilePhone(user.user_metadata?.phone || '')
      setProfileBirthDate(user.user_metadata?.birth_date || '')
    }
  }, [user])

  const isPastAppointment = (date: string, startTime: string) => {
    try {
      const now = new Date()
      // Ensure date and time are parsed correctly
      const [year, month, day] = date.split('-').map(Number)
      const [hours, minutes] = startTime.split(':').map(Number)
      const appDate = new Date(year, month - 1, day, hours, minutes)
      return appDate < now
    } catch {
      return false
    }
  }

  const loadAppointments = async (email: string, phone?: string) => {
    setDataLoading(true)
    try {
      const data = await getClientAppointmentsForPortal(email, phone)
      setAppointments(data)
      
      // Auto-trigger review modal for the last unreviewed completed/past appointment
      const lastUnreviewed = data.find(app => {
        const finished = app.status === 'completed' || isPastAppointment(app.date, app.start_time)
        return finished && (!app.reviews || app.reviews.length === 0)
      })
      
      if (lastUnreviewed) {
        setTimeout(() => {
          handleReview(lastUnreviewed)
        }, 1200)
      }
    } catch (err) {
      console.error('Portal load error:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: profileName, 
          phone: profilePhone,
          birth_date: profileBirthDate
        }
      })
      if (error) throw error
      alert('Perfil atualizado com sucesso! Estes dados serão preenchidos automaticamente nos próximos agendamentos.')
      setShowSettings(false)
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar perfil')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleReview = (app: any) => {
    setSelectedApp(app)
    setRating(5)
    setComment('')
    setShowReviewThanks(false)
    setShowReviewModal(true)
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApp) return
    setSubmittingReview(true)

    try {
      const { error } = await supabase.from('reviews').insert({
        company_id: selectedApp.company_id,
        appointment_id: selectedApp.id,
        client_id: selectedApp.client_id,
        staff_id: selectedApp.staff_id,
        rating: rating,
        comment: comment
      })

      if (error) throw error

      setShowReviewThanks(true)
      // Refresh list
      if (user?.email) loadAppointments(user.email, user.user_metadata?.phone)
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar avaliação')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isRegister) {
        const { error: regError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: fullName,
              birth_date: birthDate,
              role: 'client'
             }
          }
        })
        if (regError) throw regError
        setError('Conta criada! Verifique seu email para confirmar.')
      } else {
        const { error: logError } = await login(email, password)
        if (logError) throw logError
      }
    } catch (err: any) {
      setError(err.message || 'Erro no processo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-[#E5E2E1] font-body flex flex-col items-center justify-center p-6 selection:bg-[#fbbf24] selection:text-[#402D00]">
        <style>{`
          .font-headline { font-family: 'Space Grotesk', sans-serif; }
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300; }
        `}</style>
        
        <div className="w-full max-w-md space-y-12">
          {/* Logo */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-[1.25rem] bg-[#fbbf24] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
               <span className="material-symbols-outlined text-4xl text-[#402D00] font-black">content_cut</span>
            </div>
            <h1 className="text-4xl font-headline font-black text-white uppercase tracking-tighter">PORTAL DO <span className="text-[#fbbf24]">CLIENTE</span></h1>
            {companyContext ? (
               <p className="text-[#D3C5AC] text-sm mt-3 font-light">Acesse seus agendamentos na <span className="font-bold text-white">{companyContext.name}</span>.</p>
            ) : (
               <p className="text-[#D3C5AC] text-sm mt-3 font-light">Acesse seus agendamentos e histórico premium.</p>
            )}
          </div>

          <div className="bg-[#1C1B1B] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Form Toggle */}
            <div className="flex bg-[#0e0e0e] rounded-2xl p-1 relative z-10">
              <button 
                onClick={() => setIsRegister(false)}
                className={cn(
                  "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  !isRegister ? "bg-[#fbbf24] text-[#402D00]" : "text-zinc-600 hover:text-white"
                )}
              >
                Login
              </button>
              <button 
                onClick={() => setIsRegister(true)}
                className={cn(
                  "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  isRegister ? "bg-[#fbbf24] text-[#402D00]" : "text-zinc-600 hover:text-white"
                )}
              >
                Cadastro
              </button>
            </div>

            {error && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3 text-xs font-medium text-[#fbbf24]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6 relative z-10">
              {isRegister && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase ml-4">Nome Completo</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24]" />
                      <input 
                        type="text" 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex: Arthur Morgan"
                        className="w-full bg-[#0e0e0e] border border-white/[0.03] rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase ml-4">Data de Nascimento</label>
                    <div className="relative group">
                      <Baby className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24]" />
                      <input 
                        type="date" 
                        required 
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-white/[0.03] rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase ml-4">E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24]" />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full bg-[#0e0e0e] border border-white/[0.03] rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase ml-4">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24]" />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 caracteres"
                    className="w-full bg-[#0e0e0e] border border-white/[0.03] rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#fbbf24] text-[#402D00] font-black py-5 rounded-full text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#fbbf24]/10 hover:shadow-[#fbbf24]/20 active:scale-95 transition-all flex items-center justify-center"
              >
                {loading ? <div className="w-5 h-5 border-2 border-[#402D00]/20 border-t-[#402D00] rounded-full animate-spin" /> : (isRegister ? 'Criar Conta' : 'Entrar no Portal')}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard View
  const fallbackTargetSlug = slug || (appointments.length > 0 ? appointments[0].company?.slug : null)

  return (
    <div className="min-h-screen bg-black text-[#E5E2E1] font-body selection:bg-[#fbbf24] selection:text-[#402D00]">
      <style>{`
          .font-headline { font-family: 'Space Grotesk', sans-serif; }
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300; }
        `}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-2xl border-b border-white/[0.03]">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <Link to={fallbackTargetSlug ? `/book/${fallbackTargetSlug}` : '/'} className="flex items-center gap-3 group">
               {companyContext?.logo_url ? (
                  <img src={companyContext.logo_url} alt={companyContext.name} className="w-10 h-10 rounded-lg object-contain bg-white/5 p-1" />
               ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24]">
                     <Scissors className="w-5 h-5" />
                  </div>
               )}
               <div className="flex flex-col">
                  <span className="font-headline font-black text-xl text-white group-hover:text-[#fbbf24] transition-colors tracking-tighter uppercase leading-none">
                     {companyContext?.name || 'PORTAL DA BARBEARIA'}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black mt-1">Sessão do Cliente</span>
               </div>
            </Link>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden sm:block text-right">
                <p className="text-[9px] uppercase font-black tracking-widest text-[#fbbf24]">Perfil do Cliente</p>
                <p className="text-xs font-bold text-white uppercase">{user.user_metadata?.full_name || 'Usuário'}</p>
             </div>
             <button title="Configurar Perfil" onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-[#fbbf24] transition-all">
                <Settings className="w-5 h-5" />
             </button>
             <button title="Sair" onClick={() => logout()} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-12">
        {/* Hero Banner */}
        <section className="relative h-64 md:h-80 rounded-[3rem] overflow-hidden group shadow-2xl">
           <img 
              src="/barber_portal_banner_1774459878962.png" 
              alt="Banner" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
           <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-[#fbbf24] text-[#402D00] text-[10px] font-black uppercase tracking-widest rounded-full">Experiência Premium</span>
                 </div>
                 <h3 className="text-3xl md:text-5xl font-headline font-black text-white uppercase tracking-tighter leading-none">
                    Redefina seu <span className="text-[#fbbf24]">Estilo</span>.
                 </h3>
                 <p className="text-[#D3C5AC] text-sm md:text-base font-light max-w-sm">
                    Faça agora o seu próximo atendimento e garanta o padrão que você merece.
                 </p>
              </div>
           </div>
        </section>
        {/* Welcome Block */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
           <div className="space-y-4">
              <h2 className="text-5xl lg:text-7xl font-headline font-black text-white uppercase tracking-tighter leading-none">
                 Olá, <span className="text-[#fbbf24]">{user.user_metadata?.full_name?.split(' ')[0] || 'Cliente'}</span>.
              </h2>
              <p className="text-[#D3C5AC] text-xl font-light max-w-xl">
                 Bem-vindo de volta à sua área exclusiva. O que vamos fazer hoje?
              </p>
           </div>
           {/* Direct CTA */}
           <a 
             href={fallbackTargetSlug ? `/book/${fallbackTargetSlug}` : '#'}
             onClick={(e) => {
               if (!fallbackTargetSlug) {
                 e.preventDefault();
                 alert("Você ainda não possui histórico. Para agendar pela primeira vez, utilize o link da sua barbearia!");
               }
             }}
             className="bg-[#fbbf24] text-[#402D00] px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#fbbf24]/20 hover:scale-[1.02] transition-all flex items-center gap-3"
           >
              Fazer Novo Agendamento
              <ChevronRight className="w-4 h-4" />
           </a>
        </section>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Summary column */}
           <div className="space-y-8">
              <div className="bg-[#1C1B1B] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24]">
                       <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[9px] uppercase font-black tracking-widest text-zinc-600 leading-none mb-1">Total de Agendamentos</p>
                       <p className="text-3xl font-headline font-black text-white uppercase">{appointments.length}</p>
                    </div>
                 </div>
                 <div className="h-px w-full bg-white/[0.03]"></div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24]">
                       <Baby className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[9px] uppercase font-black tracking-widest text-zinc-600 leading-none mb-1">Data de Nascimento</p>
                       <p className="text-base font-bold text-white uppercase">{user.user_metadata?.birth_date ? new Date(user.user_metadata.birth_date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Não informada'}</p>
                    </div>
                 </div>
              </div>

           </div>

           {/* Appointments List column */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xl font-headline font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <History className="w-5 h-5 text-[#fbbf24]" />
                    Meus Agendamentos
                 </h3>
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{appointments.length} itens</span>
              </div>

              <div className="space-y-4">
                 {dataLoading ? (
                    [...Array(3)].map((_, i) => (
                       <div key={i} className="h-32 rounded-[2rem] bg-white/5 animate-pulse" />
                    ))
                 ) : appointments.length === 0 ? (
                    <div className="bg-[#131212] border border-dashed border-white/5 rounded-[2rem] p-12 text-center space-y-4">
                       <Calendar className="w-12 h-12 text-zinc-800 mx-auto" />
                       <p className="text-zinc-600 text-sm font-black uppercase tracking-widest">Nenhum agendamento encontrado</p>
                    </div>
                 ) : (
                    appointments.map((app) => {
                       const isFinished = app.status === 'completed' || isPastAppointment(app.date, app.start_time)
                       
                       return (
                         <div 
                           key={app.id} 
                           onClick={() => isFinished ? handleReview(app) : null}
                           className={cn(
                             "group bg-[#1C1B1B] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between hover:bg-[#201F1F] transition-all",
                             isFinished && "cursor-pointer active:scale-[0.98]"
                           )}
                         >
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-[1.25rem] bg-[#fbbf24] flex items-center justify-center text-[#402D00] flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Scissors className="w-8 h-8" />
                             </div>
                             <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 leading-none">{app.company?.name || 'Sua Barbearia'}</p>
                                <h4 className="text-xl font-headline font-black text-white uppercase group-hover:text-[#fbbf24] transition-colors tracking-tight">{app.service?.name}</h4>
                                <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 mt-1 uppercase">
                                   <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                                      <Calendar className="w-3 h-3 text-[#fbbf24]" />
                                      {new Date(app.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                                   </div>
                                   <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                                      <Clock className="w-3 h-3 text-[#fbbf24]" />
                                      {app.start_time}
                                   </div>
                                </div>
                             </div>
                          </div>
                                       <div className="flex flex-col items-end gap-3">
                              <div className={cn(
                                 "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                                 (app.status === 'scheduled' || app.status === 'confirmed') && !isPastAppointment(app.date, app.start_time)
                                   ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                   : "bg-zinc-800 text-zinc-500 border-white/5"
                              )}>
                                 {isFinished ? 'Finalizado' : (app.status === 'scheduled' ? 'Agendado' : 'Confirmado')}
                              </div>
                              
                               {isFinished && (
                                  <div className="flex items-center gap-1 text-[#fbbf24]">
                                     {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={cn(
                                            "w-3.5 h-3.5 transition-all", 
                                            app.reviews?.[0] 
                                              ? (i < app.reviews[0].rating ? "fill-[#fbbf24]" : "text-zinc-800")
                                              : "text-zinc-800 group-hover:text-zinc-600"
                                          )} 
                                        />
                                     ))}
                                  </div>
                               )}
                            </div>
                        </div>
                       )
                    })
                  )}
              </div>
           </div>
        </div>
      </main>
      
       {/* Powered By Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 text-center opacity-20 hover:opacity-100 transition-opacity">
         <p className="text-[9px] uppercase font-black tracking-[0.4em] text-zinc-500">
            AgendaAI Premium Portal <span className="text-white/20 mx-2">|</span> Precision Noir System
         </p>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1C1B1B] border border-white/5 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-3xl font-headline font-black uppercase text-white tracking-tighter mb-8">
              Meus <span className="text-[#fbbf24]">Dados</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Nome Completo</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24]" />
                  <input 
                    type="text" 
                    required 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-white/[0.03] rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none text-white"
                  />
                </div>
              </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Data de Nascimento</label>
                 <div className="relative group">
                   <Baby className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24]" />
                   <input 
                     type="date" 
                     required 
                     value={profileBirthDate}
                     onChange={(e) => setProfileBirthDate(e.target.value)}
                     className="w-full bg-[#0e0e0e] border border-white/[0.03] rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none text-white"
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Telefone (Celular)</label>
                 <div className="relative group">
                   <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#fbbf24]" />
                   <input 
                     type="tel" 
                     required 
                     value={profilePhone}
                     onChange={(e) => {
                       const v = e.target.value.replace(/\D/g, '')
                       let formatted = v
                       if (v.length <= 11) {
                          formatted = v.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
                       }
                       setProfilePhone(formatted)
                     }}
                     placeholder="(00) 00000-0000"
                     className="w-full bg-[#0e0e0e] border border-white/[0.03] rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none text-white"
                   />
                 </div>
               </div>
              
              <div className="pt-4 border-t border-white/5 space-y-4">
                <p className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest text-center">
                  Estes dados serão preenchidos automaticamente<br/><span className="text-[#fbbf24] font-black">na tela de agendamento</span> para agilizar seu processo.
                </p>
                <button 
                  type="submit" 
                  disabled={profileSaving}
                  className="w-full bg-[#fbbf24] text-[#402D00] py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#fbbf24]/20 hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center disabled:opacity-50"
                >
                  {profileSaving ? <div className="w-5 h-5 border-2 border-[#402D00]/20 border-t-[#402D00] rounded-full animate-spin" /> : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       {/* Review Modal */}
       {showReviewModal && selectedApp && (
         <div 
           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in"
           onClick={(e) => {
             if (e.target === e.currentTarget) setShowReviewModal(false)
           }}
         >
           <div className="bg-[#1C1B1B] border border-white/5 rounded-[3rem] p-10 w-full max-w-lg shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fbbf24]/5 blur-3xl -mr-32 -mt-32"></div>
            
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-8 right-8 w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-8 relative z-10">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-headline font-black uppercase text-white tracking-tighter">
                   Avaliar <span className="text-[#fbbf24]">Atendimento</span>
                </h3>
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Sua opinião é fundamental para nossa excelência</p>
              </div>

              {/* Staff Info */}
              <div className="flex items-center gap-6 p-6 bg-[#0e0e0e] rounded-[2rem] border border-white/[0.03]">
                 <div className="w-20 h-20 rounded-2xl bg-[#fbbf24] flex items-center justify-center text-[#402D00] overflow-hidden">
                    {selectedApp.staff?.avatar_url ? (
                       <img src={selectedApp.staff.avatar_url} alt={selectedApp.staff.name} className="w-full h-full object-cover" />
                    ) : (
                       <User className="w-10 h-10" />
                    )}
                 </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24]">Profissional</p>
                     <h4 className="text-2xl font-headline font-black text-white uppercase">{selectedApp.staff?.name || 'Seu Barbeiro'}</h4>
                     <p className="text-xs font-bold text-zinc-500 uppercase">{selectedApp.service?.name}</p>
                  </div>
              </div>

              {!showReviewThanks && (
               <form onSubmit={submitReview} className="space-y-8">
                {/* Stars */}
                <div className="space-y-4 text-center">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Como foi sua experiência?</p>
                  <div className="flex items-center justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="group transition-all"
                      >
                        <Star 
                          className={cn(
                            "w-10 h-10 transition-all",
                            star <= rating 
                              ? "text-[#fbbf24] fill-[#fbbf24] scale-110 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]" 
                              : "text-zinc-800 group-hover:text-zinc-600"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-6">Comentário (Opcional)</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Conte-nos o que achou do atendimento..."
                    rows={4}
                    className="w-full bg-[#0e0e0e] border border-white/[0.03] rounded-[2rem] px-8 py-6 text-sm focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none text-white resize-none"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="w-full bg-[#fbbf24] text-[#402D00] py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#fbbf24]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {submittingReview ? <div className="w-5 h-5 border-2 border-[#402D00]/20 border-t-[#402D00] rounded-full animate-spin" /> : 'Enviar Avaliação'}
                </button>
              </form>
              )}

              {showReviewThanks && (
                <div className="text-center py-12 space-y-8 animate-fade-in">
                  <div className="w-24 h-24 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-center mx-auto animate-bounce-short">
                    <Sparkles className="w-10 h-10 text-[#fbbf24]" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-4xl font-headline font-black text-white uppercase tracking-tighter">Obrigado!</h4>
                    <p className="text-[#D3C5AC] text-base font-light">
                      Sua avaliação foi registrada com sucesso.<br/>Isso nos ajuda a manter o padrão premium.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowReviewModal(false)}
                    className="w-full bg-[#fbbf24] text-[#402D00] py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[#fbbf24]/20"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
