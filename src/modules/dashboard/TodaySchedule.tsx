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
    <div className="card-premium">
      <h3 className="mb-6 uppercase tracking-widest text-[11px] font-bold text-text-caption">Agendamentos de Hoje</h3>

      {appointments.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-white/5 bg-white/2 text-text-muted/40 text-sm italic">
          Nenhum agendamento para hoje
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => {
            const status = statusConfig[appt.status] || statusConfig.scheduled
            const StatusIcon = status.icon
            const isInactive = appt.status === 'cancelled' || appt.status === 'no_show'

            return (
              <div
                key={appt.id}
                className={cn(
                  'flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-xl bg-white/2 border border-white/5 transition-all hover:bg-white/5 hover:border-primary/20 group',
                  isInactive && 'opacity-40 grayscale pointer-events-none'
                )}
              >
                {/* Time */}
                <div className="flex-shrink-0 text-center min-w-[64px] py-1 border-r border-white/5 pr-4 md:pr-6">
                  <p className="text-lg font-bold text-white font-headline group-hover:text-primary transition-colors">{appt.start_time.slice(0, 5)}</p>
                  <p className="text-[10px] text-text-muted/40 font-black uppercase tracking-widest mt-0.5">{appt.end_time.slice(0, 5)}</p>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-3 h-3 text-primary/50" />
                    <span className="text-sm md:text-base font-bold text-white truncate">{appt.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scissors className="w-3 h-3 text-primary/30 flex-shrink-0" />
                    <span className="text-xs text-text-muted font-medium truncate">{appt.service_name}</span>
                  </div>
                </div>

                {/* Status - Desktop */}
                <div className={cn(
                  'hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all',
                  status.color.replace('text-on-surface-variant', 'text-white').replace('text-primary-container', 'text-primary')
                )}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {status.label}
                </div>
                
                {/* Status - Mobile Dot */}
                <div className={cn(
                  'sm:hidden w-2 h-2 rounded-full shrink-0',
                  status.color.split(' ')[0]
                )} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
