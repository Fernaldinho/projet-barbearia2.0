import type { TodayAppointment } from './dashboard.api'
import { Clock, User, Scissors, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/helpers'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  scheduled: { label: 'AGENDADO', color: 'bg-on-surface-variant/5 text-on-surface-variant/40', icon: Clock },
  confirmed: { label: 'CONFIRMADO', color: 'bg-primary-container/10 text-primary-container', icon: CheckCircle },
  completed: { label: 'CONCLUÍDO', color: 'bg-success-500/5 text-success-500', icon: CheckCircle },
  cancelled: { label: 'CANCELADO', color: 'bg-danger-500/5 text-danger-500', icon: XCircle },
  no_show: { label: 'FALTA', color: 'bg-dark-500/10 text-dark-400', icon: AlertCircle },
}

interface TodayScheduleProps {
  appointments: TodayAppointment[]
}

export function TodaySchedule({ appointments }: TodayScheduleProps) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/5">
      <h3 className="!mb-10 font-headline text-2xl text-white tracking-tight uppercase font-black">Próximos Agendamentos<span className="text-primary-container">.</span></h3>

      {appointments.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant/30 text-xs font-black uppercase tracking-[0.3em] bg-surface-container-lowest/30 rounded-3xl border border-dashed border-outline-variant/10">
          Nenhum agendamento para hoje
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const status = statusConfig[appt.status] || statusConfig.scheduled
            const StatusIcon = status.icon
            const isInactive = appt.status === 'cancelled' || appt.status === 'no_show'

            return (
              <div
                key={appt.id}
                className={cn(
                  'flex items-center gap-6 p-6 rounded-[1.5rem] bg-surface-container-low transition-all duration-500 hover:bg-surface-container-highest/40 hover:translate-x-1 group',
                  isInactive && 'opacity-20 grayscale'
                )}
              >
                {/* Time */}
                <div className="flex-shrink-0 text-left min-w-[100px]">
                  <p className="text-2xl font-black text-white font-headline tracking-tighter leading-none group-hover:text-primary-container transition-colors">{appt.start_time.slice(0, 5)}</p>
                  <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest mt-1">até {appt.end_time.slice(0, 5)}</p>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white truncate tracking-tight uppercase group-hover:translate-x-1 transition-transform duration-500">{appt.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <Scissors className="w-3 h-3 text-primary-container/40 flex-shrink-0" />
                    <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest truncate">{appt.service_name}</span>
                  </div>
                </div>

                {/* Status */}
                <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex-shrink-0 shadow-sm border border-transparent transition-all group-hover:border-primary-container/10', status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

