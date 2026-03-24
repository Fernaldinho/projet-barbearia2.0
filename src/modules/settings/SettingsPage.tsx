import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext'
import { supabase } from '@/lib/supabase'
import { Building2, User, Bell, Shield, Palette, Store, Lock, BellRing, Settings as SettingsIcon, Info, Edit, Trash2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { toast } from 'react-hot-toast'

const tabs = [
  { id: 'company', label: 'PERFIL DA BARBEARIA', icon: <Store className="w-5 h-4" /> },
  { id: 'security', label: 'SEGURANÇA', icon: <Lock className="w-5 h-4" /> },
  { id: 'notifications', label: 'NOTIFICAÇÕES', icon: <BellRing className="w-5 h-4" /> },
]

export function SettingsPage() {
  const { user } = useAuth()
  const { company, updateCompany } = useCompany()
  const [activeTab, setActiveTab] = useState('company')
  const [loading, setLoading] = useState(false)

  // Company State
  const [companyName, setCompanyName] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')

  // Security State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')



  // Notifications State
  const [notifs, setNotifs] = useState({
    alerts: true,
    summary: false,
    sms: true
  })

  // Initialize state from company data
  useEffect(() => {
    if (company) {
      setCompanyName(company.name)
      setCompanyPhone(company.phone || '')
      setCompanyAddress(company.address || '')
    }
  }, [company])

  const handleSaveCompany = async () => {
    setLoading(true)
    try {
      await updateCompany({
        name: companyName,
        slug: companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        phone: companyPhone,
        address: companyAddress
      })
      toast.success('Configurações da empresa atualizadas!')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao atualizar configurações.')
    } finally {
      setLoading(false)
    }
  }


  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
    if (!/[A-Z]/.test(pwd)) return 'A senha deve conter pelo menos uma letra maiúscula.'
    if (!/[a-z]/.test(pwd)) return 'A senha deve conter pelo menos uma letra minúscula.'
    if (!/[0-9]/.test(pwd)) return 'A senha deve conter pelo menos um número.'
    return null
  }

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      toast.error('Informe sua senha atual.')
      return
    }
    const validationError = validatePassword(newPassword)
    if (validationError) {
      toast.error(validationError)
      return
    }
    setLoading(true)
    try {
      // Verificar senha atual fazendo re-login
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      })
      if (authError) {
        toast.error('Senha atual incorreta.')
        return
      }
      // Atualizar para nova senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
      toast.success('Senha atualizada com sucesso!')
      setNewPassword('')
      setCurrentPassword('')
    } catch (_err) {
      toast.error('Erro ao atualizar senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in pb-20 space-y-16 mt-8">
      {/* Search Header Style (Consistent) */}
      <div className="flex items-center px-4 lg:px-0 mb-12">
        <div className="relative flex items-center group flex-1 max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#fbbf24] transition-colors">search</span>
          <input 
            className="w-full bg-[#0e0e0e] border-none py-3.5 pl-12 pr-6 rounded-full text-sm focus:ring-1 focus:ring-[#fbbf24] placeholder:text-zinc-600 transition-all outline-none text-[#E5E2E1]" 
            placeholder="Pesquisar nas configurações..." 
            type="text"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <div className="mb-16">
          <span className="text-xs font-label text-[#fbbf24] uppercase tracking-[0.3em] font-black mb-4 block">Preferências do Sistema</span>
          <h2 className="text-6xl font-headline font-black text-[#E5E2E1] tracking-tighter uppercase leading-none">Configurações</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Vertical Tabs */}
          <nav className="w-full lg:w-72 space-y-3 flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[10px] tracking-widest text-left uppercase border border-transparent shadow-lg",
                  activeTab === tab.id
                    ? "bg-[#fbbf24] text-[#402D00] shadow-[#fbbf24]/10"
                    : "bg-[#1C1B1B] text-zinc-500 hover:text-white hover:border-white/5"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Form Area (Bento Grid Style) */}
          <div className="flex-1 space-y-8 min-w-0">
            {activeTab === 'company' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <section className="col-span-1 md:col-span-2 bg-[#1C1B1B] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h3 className="text-2xl font-black font-headline text-white uppercase tracking-tighter mb-2">Perfil da Barbearia</h3>
                      <p className="text-zinc-500 text-sm font-medium">Gerencie as informações públicas e de contato do seu negócio.</p>
                    </div>
                    <div className="w-24 h-24 rounded-2xl bg-[#0e0e0e] relative overflow-hidden group cursor-pointer border border-white/5 shadow-inner">
                      {company?.logo_url ? (
                        <img src={company.logo_url} alt="Logo" className="w-full h-full object-cover grayscale" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[#fbbf24]/40">
                          <span className="material-symbols-outlined text-4xl">storefront</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white">edit</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Nome do Estabelecimento</label>
                      <input 
                        className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none" 
                        type="text" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Telefone de Contato</label>
                      <input 
                        className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none" 
                        type="text" 
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Endereço Completo</label>
                      <input 
                        className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none" 
                        type="text" 
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-[#1C1B1B] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 bg-[#fbbf24]/10 rounded-2xl shadow-inner">
                        <span className="material-symbols-outlined text-[#fbbf24]">lock_reset</span>
                      </div>
                      <h3 className="text-xl font-black font-headline text-white uppercase tracking-tighter">Segurança</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Senha Atual</label>
                        <input 
                          className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none text-[#E5E2E1]" 
                          placeholder="Digite sua senha atual" 
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Nova Senha</label>
                        <input 
                          className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all outline-none" 
                          placeholder="Min. 8 caracteres" 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdatePassword}
                    disabled={loading || !newPassword || !currentPassword}
                    className="mt-12 bg-[#2a2a2a] text-white hover:bg-[#333] transition-all px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Processando...' : 'Atualizar Senha'}
                  </button>
                </section>

                <section className="bg-gradient-to-br from-[#1C1B1B] to-[#131313] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-[#fbbf24]/10 rounded-2xl shadow-inner text-[#fbbf24]">
                      <Info className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black font-headline text-white uppercase tracking-tighter">Info de Acesso</h3>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-medium">
                    Suas senhas são criptografadas e nunca compartilhadas. Email: <b className="text-white">{user?.email}</b>
                  </p>
                  <div className="p-6 bg-[#0e0e0e] rounded-3xl border border-white/[0.02]">
                    <p className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-widest">Último Acesso</p>
                    <p className="text-sm font-black text-[#fbbf24]">Hoje - {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'notifications' && (
              <section className="bg-[#1C1B1B] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="flex items-center gap-4 mb-12">
                  <div className="p-3 bg-[#fbbf24]/10 rounded-2xl shadow-inner text-[#fbbf24]">
                    <BellRing className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black font-headline text-white uppercase tracking-tighter">Notificações</h3>
                </div>
                <div className="space-y-8">
                  {[
                    { id: 'alerts', label: 'Alertas de Agendamento', sub: 'Receba avisos por e-mail e push em tempo real' },
                    { id: 'summary', label: 'Resumo Semanal', sub: 'Estatísticas completas de desempenho da loja' },
                    { id: 'sms', label: 'Lembretes SMS', sub: 'Enviar lembretes para clientes 2h antes do corte' },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between p-6 rounded-3xl bg-[#0e0e0e] border border-white/[0.02] hover:border-white/5 transition-all group">
                      <div>
                        <p className="font-black text-[#E5E2E1] text-base group-hover:text-[#fbbf24] transition-colors">{pref.label}</p>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">{pref.sub}</p>
                      </div>
                      <div 
                        onClick={() => setNotifs(prev => ({ ...prev, [pref.id]: !prev[pref.id as keyof typeof notifs] }))}
                        className={cn(
                          "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 cursor-pointer shadow-inner",
                          notifs[pref.id as keyof typeof notifs] ? "bg-[#fbbf24]" : "bg-zinc-800"
                        )}
                      >
                        <span 
                          className={cn(
                            "inline-block h-5 w-5 transform rounded-full bg-[#1c1b1b] transition-transform duration-300 shadow",
                            notifs[pref.id as keyof typeof notifs] ? "translate-x-6" : "translate-x-1"
                          )} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}



            {/* Action Bar */}
            <div className="flex justify-end gap-6 mt-12 bg-[#0e0e0e]/40 p-6 rounded-[2rem] border border-white/5 backdrop-blur-xl sticky bottom-4 z-10 shadow-2xl">
              <button className="px-8 py-4 text-zinc-500 font-black text-[10px] tracking-widest uppercase hover:text-white transition-all">Descartar</button>
              <button 
                onClick={handleSaveCompany}
                disabled={loading}
                className="px-12 py-4 bg-[#fbbf24] text-[#402D00] font-black text-[10px] tracking-widest uppercase rounded-full hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all active:scale-95 shadow-xl shadow-[#fbbf24]/10 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Decoration Pulse */}
      <div className="fixed bottom-0 right-0 p-12 pointer-events-none opacity-20 -z-10">
        <div className="w-[500px] h-[500px] bg-[#fbbf24]/5 rounded-full blur-[120px] animate-pulse"></div>
      </div>
    </div>
  )
}
