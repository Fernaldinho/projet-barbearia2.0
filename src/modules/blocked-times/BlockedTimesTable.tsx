import type { BlockedTime } from '@/types'
import { Edit, Trash2, Calendar, Clock, MessageSquare } from 'lucide-react'

interface BlockedTimesTableProps {
  blockedTimes: BlockedTime[]
  onEdit: (item: BlockedTime) => void
  onDelete: (id: string) => void
}

function formatDateBR(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function formatWeekday(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { weekday: 'long' })
}

function isPast(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr + 'T12:00:00')
  return date < today
}

export function BlockedTimesTable({ blockedTimes, onEdit, onDelete }: BlockedTimesTableProps) {
  if (blockedTimes.length === 0) {
    return (
    return (
      <div className="bg-surface-container-low p-20 text-center rounded-3xl animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/20">
          <Calendar className="w-10 h-10 text-dark-500" />
        </div>
        <p className="text-white text-xl font-headline font-bold mb-2">Nenhum bloqueio cadastrado</p>
        <p className="text-dark-400 text-sm max-w-xs mx-auto">Adicione bloqueios para impedir agendamentos em horários específicos.</p>
      </div>
    )
    )
  }

  return (
    <div className="bg-surface-container-low rounded-[2rem] overflow-hidden shadow-2xl shadow-black/40">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-container/30">
              <th className="text-left text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] px-8 py-5">
                Data
              </th>
              <th className="text-left text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] px-8 py-5">
                Horário
              </th>
              <th className="text-left text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] px-8 py-5">
                Motivo
              </th>
              <th className="text-right text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] px-8 py-5">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700/10">
            {blockedTimes.map((item) => {
              const past = isPast(item.date)
              return (
                <tr
                  key={item.id}
                  className={`group transition-all duration-300 hover:bg-surface-container-highest/20 ${
                    past ? 'opacity-30' : ''
                  }`}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                          past
                            ? 'bg-surface-container text-dark-500'
                            : 'bg-primary-container/10 text-primary-container'
                        }`}
                      >
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-headline font-bold text-white text-base leading-tight">
                          {formatDateBR(item.date)}
                        </p>
                        <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mt-1">
                          {formatWeekday(item.date)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 text-sm text-dark-100 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-container/40" />
                      {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {item.reason ? (
                      <div className="flex items-center gap-3 text-sm text-dark-300">
                        <span className="truncate max-w-[240px] italic">"{item.reason}"</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-dark-600 uppercase tracking-wider">Sem Motivo</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-dark-400 hover:bg-surface-container-highest hover:text-white transition-all"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-dark-400 hover:bg-danger-500/10 hover:text-danger-500 transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
