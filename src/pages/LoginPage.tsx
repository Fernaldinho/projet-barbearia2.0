import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/utils/constants'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: logError } = await login(email, password)
      if (logError) {
        setError(logError.message || 'Email ou senha incorretos. Tente novamente.')
      } else {
        navigate(ROUTES.DASHBOARD)
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="bg-[#0c0c0c] text-[#e5e2e1] font-body min-h-screen flex flex-col md:flex-row-reverse overflow-hidden">
        {/* Right Column (Visual) */}
        <section className="hidden md:flex md:w-1/2 items-center justify-center p-12 bg-zinc-950 border-l border-zinc-900/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.05)_0%,_transparent_70%)]"></div>
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-32 h-32 bg-[#fbbf24] rounded-3xl flex items-center justify-center brand-glow mb-10">
              <span className="material-symbols-outlined text-black text-6xl">content_cut</span>
            </div>
            <h2 className="font-headline text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-2 leading-tight uppercase">
              Gerencie sua
            </h2>
            <h2 className="font-headline text-4xl lg:text-5xl font-bold tracking-tighter text-[#fbbf24] mb-6 leading-tight uppercase">
              Barbearia
            </h2>
            <p className="text-[#a0a0a0] text-base lg:text-lg font-normal max-w-sm opacity-60">
              Dashboard completo, agendamentos em tempo real e muito mais.
            </p>
          </div>
        </section>

        {/* Left Column (Login Form) */}
        <section className="flex-grow flex flex-col items-center justify-center p-6 sm:p-10 md:p-16 bg-[#0c0c0c] min-h-screen">
          <div className="w-full max-w-md space-y-8 md:space-y-10">
            {/* Back Link */}
            <div className="mb-2">
              <Link to="/" className="flex items-center gap-2 text-[#a0a0a0] hover:text-[#fbbf24] transition-colors text-xs sm:text-sm group">
                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Voltar ao início
              </Link>
            </div>

            {/* Header */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-[#fbbf24] p-1 rounded-lg">
                  <span className="material-symbols-outlined text-black text-lg">content_cut</span>
                </div>
                <span className="font-headline text-2xl font-black tracking-tight text-white uppercase italic">agendai</span>
              </div>
              <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight text-white mb-2 uppercase">Bem-vindo de volta</h1>
                <p className="text-[#a0a0a0] text-sm">Entre na sua conta para acessar o painel</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center animate-fade-in font-body">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block font-medium text-sm text-[#e5e2e1]">Email</label>
                <input
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-3.5 px-4 text-[#e5e2e1] placeholder:text-zinc-600 focus:ring-1 focus:ring-[#fbbf24]/40 focus:border-[#fbbf24]/40 transition-all outline-none"
                  placeholder="seu@email.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block font-medium text-sm text-[#e5e2e1]">Senha</label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="text-xs font-medium text-[#fbbf24] hover:underline transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <input
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-3.5 px-4 text-[#e5e2e1] placeholder:text-zinc-600 focus:ring-1 focus:ring-[#fbbf24]/40 focus:border-[#fbbf24]/40 transition-all outline-none"
                  placeholder="••••••••"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  className="w-full bg-[#fbbf24] text-black font-headline font-bold py-4 rounded-lg hover:bg-amber-400 active:scale-[0.98] transition-all tracking-wide text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    'Entrar'
                  )}
                </button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-sm text-[#a0a0a0]">
                Não tem uma conta? <Link to={ROUTES.REGISTER} className="text-[#fbbf24] font-semibold hover:underline">Criar conta grátis</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
