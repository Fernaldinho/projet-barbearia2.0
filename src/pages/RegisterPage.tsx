import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/utils/constants'

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-1.5 transition-all duration-300 ${met ? 'text-green-500' : 'text-zinc-600'}`}>
      <span className="material-symbols-outlined text-[10px]">
        {met ? 'check_circle' : 'circle'}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{met ? text : text}</span>
    </div>
  )
}

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  // Password requirements state
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const isPasswordStrong = Object.values(passwordRequirements).every(Boolean)
  const isCommonPassword = ['123456', '12345678', 'senha123', 'password', 'admin123', 'barbeiro123'].includes(password.toLowerCase())

  const getPasswordStrength = () => {
    const score = Object.values(passwordRequirements).filter(Boolean).length
    if (score === 0) return 0
    if (isCommonPassword) return 1
    return score
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!companyName.trim()) {
      setError('Informe o nome da sua barbearia.')
      return
    }

    if (!isPasswordStrong) {
      setError('A sua senha não atende aos requisitos de segurança.')
      return
    }

    if (isCommonPassword) {
      setError('Esta senha é muito comum e fácil de descobrir. Use algo mais complexo.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    try {
      const { error: regError } = await register(email, password, name, companyName, phone, address)
      if (regError) {
        setError(regError.message || 'Erro ao criar conta. Tente novamente.')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-label { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
        }
        .glow-overlay {
            background: radial-gradient(circle at center, rgba(251, 191, 36, 0.08) 0%, transparent 70%);
        }
        .noir-gradient {
            background: linear-gradient(180deg, #131313 0%, #0E0E0E 100%);
        }
      `}</style>
      <main className="flex min-h-screen w-full flex-col md:flex-row overflow-hidden bg-[#131313] text-[#e5e2e1] font-body">
        {/* Left Side: Visual Branding */}
        <section className="hidden lg:flex w-1/2 relative flex-col justify-center items-center px-12 py-20 noir-gradient">
          <div className="absolute inset-0 glow-overlay pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center max-w-lg text-center">
            {/* Brand Icon */}
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-[#fbbf24]/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <span className="material-symbols-outlined text-9xl text-[#fbbf24] relative z-20">content_cut</span>
            </div>
            <h1 className="font-headline font-bold text-5xl leading-tight tracking-tighter text-[#e5e2e1] mb-6">
              COMECE AGORA <br />
              <span className="text-[#fbbf24]">GRATUITAMENTE</span>
            </h1>
            <p className="text-[#d3c5ac] font-body text-lg leading-relaxed max-w-md">
              Crie sua conta e tenha acesso a todas as ferramentas para gerenciar sua barbearia com a precisão que seu negócio merece.
            </p>
            {/* Visual Accent */}
            <div className="mt-16 flex gap-4 opacity-30">
              <div className="w-12 h-1 bg-[#fbbf24] rounded-full"></div>
              <div className="w-4 h-1 bg-[#fbbf24]/40 rounded-full"></div>
              <div className="w-4 h-1 bg-[#fbbf24]/40 rounded-full"></div>
            </div>
          </div>
          {/* Subtle background branding */}
          <div className="absolute bottom-12 left-12 opacity-10 font-headline font-bold text-2xl tracking-widest uppercase text-[#e5e2e1]">A</div>
        </section>

        {/* Right Side: Form Content */}
        <section className="flex-1 flex flex-col bg-[#131313] overflow-y-auto">
          {/* Top Navigation */}
          <div className="w-full flex justify-between items-center px-6 py-6 md:px-12">
            <Link to="/" className="font-headline font-bold text-xl md:text-2xl text-[#fbbf24] tracking-tighter uppercase shrink-0">
              agendai
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-[#d3c5ac] hover:text-[#fbbf24] transition-colors text-[10px] md:text-sm font-label uppercase tracking-wider group shrink-0">
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Voltar ao início
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center px-6 pb-16 md:px-12">
            <div className="w-full max-w-md">
              {/* Form Header */}
              <div className="mb-10 text-center md:text-left">
                <h2 className="font-headline font-bold text-3xl text-[#e5e2e1] tracking-tight mb-2 uppercase">CRIAR CONTA</h2>
                <p className="text-[#d3c5ac] text-sm font-body">Preencha os dados abaixo para começar sua jornada.</p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center animate-fade-in">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-label uppercase tracking-widest text-[#d3c5ac] ml-1" htmlFor="name">Nome completo</label>
                  <input
                    className="w-full bg-[#0e0e0e] border border-[#4f4633]/20 rounded-xl px-4 py-4 text-[#e5e2e1] placeholder:text-[#d3c5ac]/40 focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition-all outline-none"
                    id="name"
                    name="name"
                    placeholder="Ex: Arthur Morgan"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-label uppercase tracking-widest text-[#d3c5ac] ml-1" htmlFor="companyName">Nome do Estabelecimento</label>
                  <input
                    className="w-full bg-[#0e0e0e] border border-[#4f4633]/20 rounded-xl px-4 py-4 text-[#e5e2e1] placeholder:text-[#d3c5ac]/40 focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition-all outline-none"
                    id="companyName"
                    name="companyName"
                    placeholder="Ex: Barber Shop Precision"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-label uppercase tracking-widest text-[#d3c5ac] ml-1" htmlFor="phone">Telefone / WhatsApp</label>
                    <input
                      className="w-full bg-[#0e0e0e] border border-[#4f4633]/20 rounded-xl px-4 py-4 text-[#e5e2e1] placeholder:text-[#d3c5ac]/40 focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition-all outline-none"
                      id="phone"
                      name="phone"
                      placeholder="(11) 99999-9999"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        if (val.length <= 11) setPhone(val)
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-label uppercase tracking-widest text-[#d3c5ac] ml-1" htmlFor="address">Endereço Completo</label>
                    <input
                      className="w-full bg-[#0e0e0e] border border-[#4f4633]/20 rounded-xl px-4 py-4 text-[#e5e2e1] placeholder:text-[#d3c5ac]/40 focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition-all outline-none"
                      id="address"
                      name="address"
                      placeholder="Rua, Número, Bairro, Cidade"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-label uppercase tracking-widest text-[#d3c5ac] ml-1" htmlFor="email">Email</label>
                  <input
                    className="w-full bg-[#0e0e0e] border border-[#4f4633]/20 rounded-xl px-4 py-4 text-[#e5e2e1] placeholder:text-[#d3c5ac]/40 focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition-all outline-none"
                    id="email"
                    name="email"
                    placeholder="nome@exemplo.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-label uppercase tracking-widest text-[#d3c5ac] ml-1" htmlFor="password">Senha</label>
                    <div className="relative">
                      <input
                        className="w-full bg-[#0e0e0e] border border-[#4f4633]/20 rounded-xl px-4 py-4 text-[#e5e2e1] placeholder:text-[#d3c5ac]/40 focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition-all outline-none"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="absolute right-4 top-4 text-[#d3c5ac] hover:text-[#fbbf24] transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {password && (
                      <div className="mt-3 space-y-3 animate-fade-in px-1">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-full flex-1 rounded-full transition-all duration-500 ${
                                getPasswordStrength() >= level
                                  ? getPasswordStrength() === 4 ? 'bg-green-500' : 'bg-[#fbbf24]'
                                  : 'bg-white/5'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <RequirementItem met={passwordRequirements.length} text="Mín. 8 caracteres" />
                          <RequirementItem met={passwordRequirements.uppercase} text="Letra maiúscula" />
                          <RequirementItem met={passwordRequirements.number} text="Um número" />
                          <RequirementItem met={passwordRequirements.special} text="Caractere especial" />
                        </div>

                        {isCommonPassword && (
                          <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">warning</span>
                            Senha muito comum / vulnerável
                          </p>
                        )}
                        
                        {!isPasswordStrong && !isCommonPassword && (
                          <p className="text-[10px] text-[#fbbf24]/60 font-medium uppercase tracking-wider">
                            Crie uma senha segura para proteger sua conta
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-label uppercase tracking-widest text-[#d3c5ac] ml-1" htmlFor="confirm_password">Confirmar senha</label>
                    <input
                      className="w-full bg-[#0e0e0e] border border-[#4f4633]/20 rounded-xl px-4 py-4 text-[#e5e2e1] placeholder:text-[#d3c5ac]/40 focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition-all outline-none"
                      id="confirm_password"
                      name="confirm_password"
                      placeholder="••••••••"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    className="w-full bg-[#fbbf24] text-[#402d00] hover:bg-[#fbbf24]/90 py-5 rounded-full font-headline font-bold text-base uppercase tracking-widest shadow-lg shadow-[#fbbf24]/10 active:scale-95 transition-all flex items-center justify-center disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading || !isPasswordStrong || isCommonPassword}
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin" />
                    ) : (
                      'Criar conta grátis'
                    )}
                  </button>
                </div>
              </form>

              {/* Form Footer */}
              <div className="mt-8 text-center space-y-8">
                <p className="text-[#d3c5ac] text-sm font-body">
                  Já tem uma conta? <Link to={ROUTES.LOGIN} className="text-[#fbbf24] font-semibold hover:underline decoration-[#fbbf24]/30 underline-offset-4">Fazer login</Link>
                </p>
                <div className="pt-8 border-t border-[#4f4633]/10">
                  <p className="text-[10px] text-[#d3c5ac]/50 font-label uppercase tracking-[0.2em] leading-relaxed">
                    Ao criar sua conta, você concorda com nossos <br />
                    <a className="hover:text-[#fbbf24] transition-colors" href="#">Termos de Serviço</a> e <a className="hover:text-[#fbbf24] transition-colors" href="#">Política de Privacidade</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Branding Footer */}
          <footer className="w-full py-8 px-12 flex flex-col md:flex-row justify-between items-center border-t border-[#4f4633]/5">
            <p className="text-[10px] font-label uppercase tracking-widest text-[#d3c5ac]/50 mb-4 md:mb-0">
              © {new Date().getFullYear()} agendai. Precision Noir.
            </p>
            <div className="flex gap-6">
              <a className="text-[10px] font-label uppercase tracking-widest text-[#d3c5ac]/50 hover:text-[#fbbf24] transition-all" href="#">Suporte</a>
              <a className="text-[10px] font-label uppercase tracking-widest text-[#d3c5ac]/50 hover:text-[#fbbf24] transition-all" href="#">Status</a>
            </div>
          </footer>
        </section>
      </main>
    </>
  )
}
