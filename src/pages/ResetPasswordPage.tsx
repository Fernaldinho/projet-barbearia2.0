import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ShieldCheck, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, APP_NAME } from '@/utils/constants'

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const { error } = await updatePassword(password)
      if (error) {
        setError(error.message || 'Erro ao redefinir senha. Tente novamente.')
      } else {
        setSuccess(true)
        setTimeout(() => {
          navigate(ROUTES.LOGIN)
        }, 3000)
      }
    } catch {
      setError('Erro ao redefinir senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#fbbf24]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-[#fbbf24] flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight uppercase italic">{APP_NAME}</span>
        </div>

        <div className="bg-[#131313] border border-white/5 p-8 rounded-[2rem] shadow-2xl">
          {success ? (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Senha Redefinida!</h1>
              <p className="text-zinc-500 text-sm mb-8 font-medium">
                Sua senha foi alterada com sucesso. Você será redirecionado para o login em instantes...
              </p>
              <Link to={ROUTES.LOGIN} className="w-full py-4 bg-[#fbbf24] text-black rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                Ir para o login agora
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Nova Senha</h1>
                <p className="text-zinc-500 text-sm font-medium">
                  Crie uma nova senha segura para acessar sua conta.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center animate-fade-in font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0c0c0c] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition-all outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0c0c0c] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-1 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition-all outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#fbbf24] text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#fbbf24]/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    'Redefinir Senha'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
