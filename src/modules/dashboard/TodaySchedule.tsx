import type { TodayAppointment } from './dashboard.api'
import { Clock, User, Scissors, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/helpers'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  scheduled: { label: 'Agendado', color: 'bg-on-surface-variant/10 text-on-surface-variant', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'bg-primary-container/10 text-primary-container', icon: CheckCircle },
  completed: { label: 'Concluído', color: 'bg-success-500/10 text-success-500', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-danger-500/10 text-danger-500', icon: XCircle },
  no_show: { label: 'Falta', color: 'bg-dark-500/10 text-dark-400', icon: AlertCircle },
}

interface TodayScheduleProps {
  appointments: TodayAppointment[]
}

export function TodaySchedule({ appointments }: TodayScheduleProps) {
  return (
    <div className="p-[24px] rounded-2xl bg-surface-container-low">
      <h3 className="!mb-[24px] font-headline text-xl text-white">Próximos Agendamentos</h3>

      {appointments.length === 0 ? (
        <div className="text-center py-10 text-on-surface-variant/50 text-sm italic">
          Nenhum agendamento para hoje
        </div>
      ) : (
        <div className="space-y-[12px]">
          {appointments.map((appt) => {
            const status = statusConfig[appt.status] || statusConfig.scheduled
            const StatusIcon = status.icon
            const isInactive = appt.status === 'cancelled' || appt.status === 'no_show'

            return (
              <div
                key={appt.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl bg-surface-container/30 transition-all hover:bg-surface-container-highest/50',
                  isInactive && 'opacity-40'
                )}
              >
                {/* Time */}
                <div className="flex-shrink-0 text-center min-w-[60px]">
                  <p className="text-base font-bold text-white font-headline">{appt.start_time.slice(0, 5)}</p>
                  <p className="text-[11px] text-on-surface-variant/60 font-medium">{appt.end_time.slice(0, 5)}</p>
                </div>

                <div className="w-px h-10 bg-outline-variant/20 flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-white truncate">{appt.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Scissors className="w-3 h-3 text-primary-container/70 flex-shrink-0" />
                    <span className="text-xs text-on-surface-variant font-medium truncate">{appt.service_name}</span>
                  </div>
                </div>

                {/* Status */}
                <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex-shrink-0 transition-colors', status.color)}>
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
