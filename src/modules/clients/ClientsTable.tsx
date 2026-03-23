import type { Client } from '@/types'
import { History, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface ClientsTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (id: string) => void
}

export function ClientsTable({ clients, onEdit, onDelete }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="p-20 text-center bg-[#1C1B1B] rounded-[2.5rem] border border-dashed border-[#4F4633]/20 shadow-inner">
        <p className="text-zinc-500 font-medium">Nenhum cliente encontrado na busca premium.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1C1B1B] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0e0e0e]/50 border-b border-white/5">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Cliente</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Contato</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Última Visita</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Gasto Total</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-white/[0.02] transition-all group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-[#353534] flex items-center justify-center overflow-hidden border border-white/5 shadow-inner grow-0 shrink-0">
                      <span className="text-sm font-black text-[#fbbf24]">{client.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#E5E2E1] text-lg group-hover:text-[#fbbf24] transition-colors">{client.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Membro Platinum</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 text-base text-zinc-400 font-medium">{client.phone}</td>
                <td className="px-10 py-8 text-base text-zinc-400 font-medium">14 Out, 2023</td>
                <td className="px-10 py-8">
                  <span className="text-[#fbbf24] font-black font-headline text-lg tracking-tighter">R$ 1.450,00</span>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-all">
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all shadow-lg active:scale-95">
                      <History className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onEdit(client)}
                      className="p-3 bg-white/5 hover:bg-[#fbbf24]/10 rounded-2xl text-zinc-400 hover:text-[#fbbf24] transition-all shadow-lg active:scale-95"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(client.id)}
                      className="p-3 bg-white/5 hover:bg-red-500/10 rounded-2xl text-zinc-400 hover:text-red-500 transition-all shadow-lg active:scale-95"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Style */}
      <div className="px-10 py-10 bg-[#0e0e0e]/20 flex justify-between items-center border-t border-white/5">
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
