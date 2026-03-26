import type { Client } from '@/types'
import { History, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/utils/helpers'

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
      <div className="p-20 text-center bg-[#1C1B1B] rounded-[2.5rem] border border-dashed border-[#4F4633]/20 shadow-inner">
        <p className="text-zinc-500 font-medium">Nenhum cliente encontrado na busca premium.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1C1B1B] rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0e0e0e]/50 border-b border-white/5">
              <th className="px-3 sm:px-6 lg:px-10 py-3 lg:py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Cliente</th>
              <th className="px-3 sm:px-6 lg:px-10 py-3 lg:py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Contato</th>
              <th className="px-3 sm:px-6 lg:px-10 py-3 lg:py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Última</th>
              <th className="px-3 sm:px-6 lg:px-10 py-3 lg:py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Gasto</th>
              <th className="px-3 sm:px-6 lg:px-10 py-3 lg:py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {clients.map((client, index) => (
              <tr 
                key={client.id} 
                className={cn(
                  "hover:bg-white/[0.02] transition-all group",
                  maxClients !== undefined && maxClients !== -1 && index >= maxClients
                    ? "blur-[4px] opacity-40 select-none pointer-events-none"
                    : ""
                )}
              >
                <td className="px-3 sm:px-6 lg:px-10 py-3 sm:py-6 lg:py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#353534] flex items-center justify-center overflow-hidden border border-white/5 shadow-inner grow-0 shrink-0">
                      <span className="text-[10px] sm:text-sm font-black text-[#fbbf24]">{client.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#E5E2E1] text-xs sm:text-lg group-hover:text-[#fbbf24] transition-colors line-clamp-1">{client.name}</p>
                      <p className="text-[7px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">Ativo</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 lg:px-10 py-3 sm:py-6 lg:py-8 text-xs sm:text-base text-zinc-400 font-medium whitespace-nowrap">{client.phone}</td>
                <td className="px-3 sm:px-6 lg:px-10 py-3 sm:py-6 lg:py-8 text-xs sm:text-base text-zinc-400 font-medium whitespace-nowrap">{getLastVisit(client.appointments)}</td>
                <td className="px-3 sm:px-6 lg:px-10 py-3 sm:py-6 lg:py-8">
                  <span className="text-[#fbbf24] font-black font-headline text-sm sm:text-lg tracking-tighter whitespace-nowrap">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotalSpent(client.appointments))}
                  </span>
                </td>
                <td className="px-3 sm:px-6 lg:px-10 py-3 sm:py-6 lg:py-8 text-right">
                  <div className="flex justify-end gap-1.5 sm:gap-3 opacity-40 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => onViewHistory(client)}
                      className="p-1.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-lg sm:rounded-2xl text-zinc-400 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                      <History className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </button>
                    <button 
                      onClick={() => onEdit(client)}
                      className="p-1.5 sm:p-3 bg-white/5 hover:bg-[#fbbf24]/10 rounded-lg sm:rounded-2xl text-zinc-400 hover:text-[#fbbf24] transition-all shadow-lg active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(client.id)}
                      className="p-1.5 sm:p-3 bg-white/5 hover:bg-red-500/10 rounded-lg sm:rounded-2xl text-zinc-400 hover:text-red-500 transition-all shadow-lg active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Style */}
      <div className="px-6 py-6 sm:px-10 sm:py-10 bg-[#0e0e0e]/20 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5">
        <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">
          Mostrando <span className="text-[#E5E2E1]">{clients.length}</span> de {clients.length} clientes premium
        </p>
        <div className="flex gap-3">
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 text-zinc-500 hover:text-[#fbbf24] hover:bg-[#fbbf24]/5 transition-all active:scale-95">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#fbbf24] text-[#402D00] font-black shadow-xl shadow-[#fbbf24]/10 active:scale-95">1</button>
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 text-zinc-500 hover:text-[#fbbf24] transition-all active:scale-95">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
