import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/utils/constants'
import { toast } from 'react-hot-toast'

export function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      // 1. Create slug
      const baseSlug = companyName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
      
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{
          name: companyName,
          slug: baseSlug,
          phone,
          address,
          created_by: user.id
        }])
        .select()
        .single()

      if (companyError) throw companyError

      // 2. Link user to company
      const { error: profileError } = await supabase
        .from('users')
        .upsert([{
          id: user.id,
          company_id: company.id,
          role: 'owner'
        }])

      if (profileError) throw profileError

      toast.success('Empresa configurada com sucesso!')
      window.location.href = ROUTES.DASHBOARD // Force refresh to update all contexts
    } catch (err: any) {
      toast.error(err.message || 'Erro ao configurar empresa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center p-6 font-body">
      <div className="max-w-md w-full space-y-8 bg-zinc-950 p-10 rounded-3xl border border-zinc-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
        
        <div className="relative">
          <h2 className="text-3xl font-headline font-bold text-white uppercase tracking-tighter">
            COMPLETE SEU <span className="text-amber-500">PERFIL</span>
          </h2>
          <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
            Detectamos que sua conta ainda não possui uma barbearia vinculada. Vamos configurar isso agora?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Nome da Barbearia</label>
            <input
              required
              className="w-full bg-black border border-zinc-900 rounded-2xl px-5 py-4 text-white focus:border-amber-500 transition-all outline-none"
              placeholder="Ex: Precision Barbers"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Telefone</label>
            <input
              required
              className="w-full bg-black border border-zinc-900 rounded-2xl px-5 py-4 text-white focus:border-amber-500 transition-all outline-none"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Endereço Completo</label>
            <input
              required
              className="w-full bg-black border border-zinc-900 rounded-2xl px-5 py-4 text-white focus:border-amber-500 transition-all outline-none"
              placeholder="Rua, Número, Bairro"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-black py-5 rounded-full font-headline font-bold uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Finalizar Configuração'}
          </button>
        </form>
      </div>
    </div>
  )
}
