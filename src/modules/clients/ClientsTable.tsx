import { History, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Client } from '@/types'
import { cn, formatCurrency } from '@/utils/helpers'

interface ClientsTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (id: string) => void
  onViewHistory: (client: Client) => void
  maxClients?: number
}

export function ClientsTable({ clients, onEdit, onDelete, onViewHistory, maxClients }: ClientsTableProps) {
  const calculateTotalSpent = (appointments?: any[]) => {
    if (!appointments) return 0
    return appointments.reduce((sum, apt) => {
      if (apt.status !== 'cancelled' && apt.status !== 'no_show') {
         return sum + (apt.service?.price || 0)
      }
      return sum
    }, 0)
  }

  const getLastVisit = (appointments?: any[]) => {
    if (!appointments || appointments.length === 0) return '-'
    const valid = appointments.filter(a => a.status === 'completed' || new Date(a.date) <= new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (valid.length === 0) return '-'
    const vDate = new Date(valid[0].date)
    return new Date(vDate.getTime() + vDate.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR')
  }

  if (clients.length === 0) {
    return (
      <div className="card-premium py-20 text-center">
        <p className="text-text-muted font-medium">Nenhum cliente encontrado na busca premium.</p>
      </div>
    )
  }

  return (
    <div className="card-premium p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/2 border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-text-muted/40">Cliente</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-text-muted/40">Contato</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-text-muted/40">Última Visita</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-text-muted/40">Faturamento</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-text-muted/40 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {clients.map((client, index) => (
              <tr 
                key={client.id} 
                className={cn(
                  "hover:bg-white/2 transition-all group",
                  maxClients !== undefined && maxClients !== -1 && index >= maxClients
                    ? "blur-[6px] opacity-40 select-none pointer-events-none"
                    : ""
                )}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-xs font-black text-primary">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{client.name}</p>
                      <p className="text-[9px] text-text-muted/40 uppercase font-black tracking-widest mt-1">Status Ativo</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-text-muted font-medium opacity-60">{client.phone}</td>
                <td className="px-8 py-6 text-sm text-text-muted font-medium opacity-60">{getLastVisit(client.appointments)}</td>
                <td className="px-8 py-6">
                  <span className="text-primary font-bold font-headline text-lg">
                    {formatCurrency(calculateTotalSpent(client.appointments)).replace(',00', '')}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => onViewHistory(client)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-text-muted hover:bg-primary hover:text-primary-text transition-all"
                      title="Histórico"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(client)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-text-muted hover:bg-primary hover:text-primary-text transition-all"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(client.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-text-muted hover:bg-red-500 hover:text-white transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Style */}
      <div className="px-8 py-8 bg-white/2 flex flex-col sm:flex-row justify-between items-center border-t border-white/5 gap-4">
        <p className="text-[10px] text-text-muted/40 font-black uppercase tracking-widest">
          Mostrando <span className="text-white">{clients.length}</span> de {clients.length} registros
        </p>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/5 text-text-muted hover:text-primary hover:bg-white/5 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-text font-black text-xs">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/5 text-text-muted hover:text-primary transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
