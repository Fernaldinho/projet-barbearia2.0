import { useEffect, useState } from 'react'
import { X, Calendar, Clock, DollarSign } from 'lucide-react'
import type { Client } from '@/types'
import { getClientAppointments } from './clients.api'
import { cn } from '@/utils/helpers'

interface Props {
  client: Client
  onClose: () => void
}

export function ClientHistoryModal({ client, onClose }: Props) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientAppointments(client.id)
        setAppointments(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [client.id])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1C1B1B] border border-white/5 rounded-[2.5rem] p-8 w-full max-w-3xl shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute right-8 top-8 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <span className="text-[#fbbf24] text-[10px] font-black uppercase tracking-[0.3em]">Histórico do Cliente</span>
          <h2 className="text-3xl font-headline font-black text-white mt-2 tracking-tighter">{client.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-medium">
              Nenhum agendamento encontrado para este cliente.
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(apt => (
                <div key={apt.id} className="bg-[#0e0e0e] border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-[#fbbf24]/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:text-[#fbbf24] transition-colors">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{apt.service?.name || 'Serviço Excluído'}</h4>
                      <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                         <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(apt.date).toLocaleDateString('pt-BR')} às {apt.start_time.substring(0,5)}</span>
                         <span className="flex items-center gap-1"><DollarSign className="w-4 h-4"/> R$ {apt.service?.price || '0'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      apt.status === 'completed' && "bg-emerald-500/10 text-emerald-500",
                      apt.status === 'scheduled' && "bg-[#fbbf24]/10 text-[#fbbf24]",
                      apt.status === 'cancelled' && "bg-red-500/10 text-red-500",
                      apt.status === 'no_show' && "bg-zinc-500/10 text-zinc-500"
                    )}>
                      {apt.status === 'completed' && 'Concluído'}
                      {apt.status === 'scheduled' && 'Agendado'}
                      {apt.status === 'cancelled' && 'Cancelado'}
                      {apt.status === 'no_show' && 'Falta'}
                      {!['completed', 'scheduled', 'cancelled', 'no_show'].includes(apt.status) && apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
