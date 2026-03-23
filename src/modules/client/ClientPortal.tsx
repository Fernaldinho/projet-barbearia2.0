import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  Sparkles
} from 'lucide-react'
import { getClientAppointments } from '../clients/clients.api'
import { supabase } from '@/lib/supabase'

export function ClientPortal() {
  const { user, login, logout, loading: authLoading } = useAuth()
  const navigate = useNavigate()

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

  useEffect(() => {
    if (user?.email) {
      loadAppointments(user.email)
    }
  }, [user])

  const loadAppointments = async (email: string) => {
    setDataLoading(true)
    try {
      const data = await getClientAppointments(email)
      setAppointments(data)
    } catch (err) {
      console.error('Portal load error:', err)
    } finally {
      setDataLoading(false)
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
        <style dangerouslySetInnerHTML={{__html: `
          .font-headline { font-family: 'Space Grotesk', sans-serif; }
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300; }
        `}} />
        
        <div className="w-full max-w-md space-y-12">
          {/* Logo */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-[1.25rem] bg-[#fbbf24] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
               <span className="material-symbols-outlined text-4xl text-[#402D00] font-black">content_cut</span>
            </div>
            <h1 className="text-4xl font-headline font-black text-white uppercase tracking-tighter">PORTAL DO <span className="text-[#fbbf24]">CLIENTE</span></h1>
            <p className="text-[#D3C5AC] text-sm mt-3 font-light">Acesse seus agendamentos e histórico premium.</p>
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
  return (
    <div className="min-h-screen bg-black text-[#E5E2E1] font-body selection:bg-[#fbbf24] selection:text-[#402D00]">
      <style dangerouslySetInnerHTML={{__html: `
          .font-headline { font-family: 'Space Grotesk', sans-serif; }
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300; }
        `}} />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-2xl border-b border-white/[0.03]">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="font-headline font-black text-xl text-[#fbbf24] tracking-tighter uppercase">agendai</Link>
          <div className="flex items-center gap-6">
             <div className="hidden sm:block text-right">
                <p className="text-[9px] uppercase font-black tracking-widest text-[#fbbf24]">Perfil do Cliente</p>
                <p className="text-xs font-bold text-white uppercase">{user.user_metadata?.full_name || 'Usuário'}</p>
             </div>
             <button onClick={() => logout()} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Welcome Block */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
           <div className="space-y-4">
              <h2 className="text-5xl lg:text-7xl font-headline font-black text-white uppercase tracking-tighter leading-none">
                 Olá, <span className="text-[#fbbf24]">{user.user_metadata?.full_name?.split(' ')[0] || 'Cliente'}</span>.
              </h2>
              <p className="text-[#D3C5AC] text-xl font-light max-w-xl">
                 Bem-vindo de volta à sua área exclusiva. O que vamos agendar hoje?
              </p>
           </div>
           {/* Direct CTA */}
           <a 
             href="/"
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

              {/* Tips / Promo Box */}
              <div className="bg-gradient-to-br from-[#fbbf24] to-[#402D00] rounded-[2.5rem] p-8 text-[#402D00] shadow-2xl group cursor-pointer overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700"></div>
                 <Sparkles className="w-10 h-10 mb-6 font-bold" />
                 <h4 className="text-2xl font-headline font-black uppercase tracking-tight mb-2">Clube VIP</h4>
                 <p className="text-sm font-bold opacity-70 leading-relaxed uppercase tracking-wider">Acumule 10 cortes e ganhe uma barboterapia completa.</p>
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
                       <a href="/" className="text-[#fbbf24] text-xs font-bold uppercase hover:underline">Ir para página inicial</a>
                    </div>
                 ) : (
                    appointments.map((app) => (
                       <div key={app.id} className="group bg-[#1C1B1B] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between hover:bg-[#201F1F] transition-all">
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
                          
                          <div className={cn(
                             "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                             app.status === 'scheduled' || app.status === 'confirmed' 
                               ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                               : "bg-zinc-800 text-zinc-500 border-white/5"
                          )}>
                             {app.status === 'scheduled' ? 'Agendado' : app.status === 'confirmed' ? 'Confirmado' : 'Finalizado'}
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      </main>
      
      <footer className="max-w-4xl mx-auto px-6 py-12 text-center opacity-20 hover:opacity-100 transition-opacity">
         <p className="text-[9px] uppercase font-black tracking-[0.4em] text-zinc-500">
            AgendaAI Premium Portal <span className="text-white/20 mx-2">|</span> Precision Noir System
         </p>
      </footer>
    </div>
  )
}
