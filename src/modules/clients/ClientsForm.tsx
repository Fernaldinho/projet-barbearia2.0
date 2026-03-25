import { useState } from 'react'
import type { ClientFormData, Client } from '@/types'
import { X, UserPlus, Phone, Mail, FileText, AlertTriangle } from 'lucide-react'
import { formatPhone } from '@/utils/helpers'

interface ClientsFormProps {
  initialData?: Client | null
  onSubmit: (data: ClientFormData) => Promise<void>
  onClose: () => void
}

export function ClientsForm({ initialData, onSubmit, onClose }: ClientsFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone ? formatPhone(initialData.phone) : '',
    notes: initialData?.notes || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (formData.phone) {
      const digits = formData.phone.replace(/\D/g, '')
      if (digits.length < 10) {
        setError('Telefone inválido. Informe um número válido.')
        return
      }
    }

    setLoading(true)
    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || 'Erro ao sincronizar dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in px-4">
      <div className="bg-bg-surface w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-border-subtle">
        
        {/* Header Section */}
        <div className="px-6 py-8 md:px-10 md:py-10 flex items-center justify-between border-b border-border-subtle bg-white/2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-headline tracking-tight uppercase">
                {initialData ? 'Editar Cliente' : 'Novo Registro'}
              </h2>
              <p className="text-[10px] text-text-muted/60 font-black uppercase tracking-widest mt-1">
                Base de dados CRM Premium
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[11px] font-bold uppercase tracking-widest">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="client-name" className="form-label">Nome Completo</label>
            <div className="relative group">
               <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/20 group-focus-within:text-primary transition-colors" />
               <input
                id="client-name"
                type="text"
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do cliente"
                className="input-base pl-12"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="client-phone" className="form-label">WhatsApp / Telefone</label>
            <div className="relative group">
               <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/20 group-focus-within:text-primary transition-colors" />
               <input
                id="client-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                placeholder="(00) 00000-0000"
                className="input-base pl-12"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="client-email" className="form-label text-text-muted/40">Email (Opcional)</label>
            <div className="relative group opacity-60 focus-within:opacity-100 transition-opacity">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/20 group-focus-within:text-primary transition-colors" />
               <input
                id="client-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="input-base pl-12"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="client-notes" className="form-label text-text-muted/40">Observações Estratégicas</label>
            <div className="relative group opacity-60 focus-within:opacity-100 transition-opacity">
               <FileText className="absolute left-4 top-4 w-5 h-5 text-text-muted/20 group-focus-within:text-primary transition-colors" />
               <textarea
                id="client-notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Preferências, estilo ou observações..."
                className="input-base pl-12 py-4 h-auto resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 mt-2 border-t border-white/5">
            <button type="button" onClick={onClose} className="btn-secondary h-12 px-8">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary h-12 px-10">
              {loading ? 'Sincronizando...' : initialData ? 'Salvar Registro' : 'Efetivar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
