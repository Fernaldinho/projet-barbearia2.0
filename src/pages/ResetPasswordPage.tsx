import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ShieldCheck, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, APP_NAME } from '@/utils/constants'

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-1.5 transition-all duration-300 ${met ? 'text-green-500' : 'text-zinc-600'}`}>
      <div className={`w-1 h-1 rounded-full ${met ? 'bg-green-500' : 'bg-zinc-800'}`} />
      <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{text}</span>
    </div>
  )
}

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { updatePassword } = useAuth()
  const navigate = useNavigate()

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
                  <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                    <RequirementItem met={passwordRequirements.length} text="8 caracteres" />
                    <RequirementItem met={passwordRequirements.uppercase} text="Letra maiúscula" />
                    <RequirementItem met={passwordRequirements.number} text="Número" />
                    <RequirementItem met={passwordRequirements.special} text="Caractere especial" />
                  </div>
                  {password.length > 0 && isCommonPassword && (
                    <p className="text-red-500 text-xs mt-2 animate-fade-in font-medium">
                      Esta senha é muito comum e fácil de descobrir.
                    </p>
                  )}
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
                  disabled={loading || !isPasswordStrong || isCommonPassword}
                  className="w-full py-4 bg-[#fbbf24] text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#fbbf24]/10 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center"
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
