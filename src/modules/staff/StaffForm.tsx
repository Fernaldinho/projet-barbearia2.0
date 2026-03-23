import { useState, useRef } from 'react'
import { X, AlertCircle, Camera, User, UserCircle, Loader2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Staff, StaffFormData } from '@/types'
import { cn } from '@/utils/helpers'

interface StaffFormProps {
  initialData?: Staff | null
  onSubmit: (data: StaffFormData) => Promise<void>
  onClose: () => void
}

export function StaffForm({ initialData, onSubmit, onClose }: StaffFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [role, setRole] = useState(initialData?.role || '')
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `staff/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
    } catch (err: any) {
      console.error('Error uploading:', err)
      setError('Falha ao enviar imagem. Verifique se o bucket "avatars" existe.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) { setError('Informe o nome do profissional.'); return }
    setLoading(true)
    try {
      await onSubmit({ 
        name: name.trim(), 
        role: role.trim(), 
        avatar_url: avatarUrl 
      })
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in py-10 overflow-y-auto">
      <div className="bg-[#1C1B1B] w-full max-w-[500px] border border-white/5 rounded-[3rem] overflow-hidden mx-4 animate-scale-in shadow-[0_0_50px_rgba(251,191,36,0.05)]">
        <div className="flex items-center justify-between p-8 border-b border-white/[0.03]">
          <h2 className="text-2xl font-black font-headline text-white uppercase tracking-tighter !mb-0">
            {initialData ? 'Ajustar Profissional' : 'Novo Barbeiro Elite'}
          </h2>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-zinc-400 hover:text-[#fbbf24] hover:bg-[#fbbf24]/5 transition-all outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
             <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-[2.5rem] bg-[#0e0e0e] border border-white/5 overflow-hidden flex items-center justify-center group-hover:border-[#fbbf24]/30 transition-all shadow-inner relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="text-zinc-700 group-hover:text-[#fbbf24]/40 transition-colors">
                      <UserCircle className="w-20 h-20 stroke-[1]" />
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-[#fbbf24] animate-spin" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[#fbbf24]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                </div>
                <button 
                  type="button" 
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#fbbf24] text-[#402D00] rounded-2xl flex items-center justify-center shadow-xl shadow-[#fbbf24]/20"
                >
                  <Plus className="w-6 h-6 font-bold" />
                </button>
             </div>
             <input 
               type="file" 
               className="hidden" 
               ref={fileInputRef} 
               accept="image/*"
               onChange={handleUpload}
               disabled={uploading}
             />
             <p className="mt-4 text-[10px] uppercase font-black tracking-widest text-zinc-500">Foto de Perfil Ultra-Def</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Nome Completo</label>
              <input 
                className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none placeholder-zinc-800"
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Insira o nome do artista" 
                required 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Função / Título Premium</label>
              <input 
                className="w-full bg-[#0e0e0e] border border-white/5 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-[#fbbf24] transition-all text-[#E5E2E1] outline-none placeholder-zinc-800"
                type="text" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Master Barber, Hairstylist..." 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/[0.03]">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-[#252525] text-zinc-400 py-4 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || uploading} 
              className="flex-1 bg-[#fbbf24] text-[#402D00] py-4 rounded-full font-black text-[10px] tracking-widest uppercase shadow-xl shadow-[#fbbf24]/10 hover:shadow-[#fbbf24]/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processando...' : initialData ? 'Salvar Edição' : 'Contratar Agora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
