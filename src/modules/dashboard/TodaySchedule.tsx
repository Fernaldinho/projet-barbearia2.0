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
  // Filtrar apenas agendamentos futuros que não foram finalizados/cancelados
  const upcomingAppointments = appointments.filter((appt) => {
    if (['completed', 'cancelled', 'no_show'].includes(appt.status)) {
      return false
    }

    // Se passou do horário de término, sai dos "Próximos"
    const now = new Date()
    const [hours, minutes] = appt.end_time.split(':').map(Number)
    const apptEndTime = new Date()
    apptEndTime.setHours(hours, minutes, 0, 0)

    return apptEndTime > now
  })

  return (
    <div className="p-3 sm:p-6 lg:p-8 rounded-2xl bg-surface-container-low border border-white/5 shadow-2xl">
      <h3 className="text-base font-black font-headline text-[#E5E2E1] uppercase tracking-tighter mb-2 sm:mb-6">Próximos Agendamentos</h3>

      {upcomingAppointments.length === 0 ? (
        <div className="text-center py-6 sm:py-10 text-on-surface-variant/50 text-xs sm:text-sm italic">
          Nenhum agendamento próximo para hoje
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {upcomingAppointments.map((appt) => {
            const status = statusConfig[appt.status] || statusConfig.scheduled
            const StatusIcon = status.icon
            const isInactive = appt.status === 'cancelled' || appt.status === 'no_show'

            return (
              <div
                key={appt.id}
                className={cn(
                  'flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-lg bg-surface-container/30 transition-all hover:bg-surface-container-highest/50',
                  isInactive && 'opacity-40'
                )}
              >
                {/* Time */}
                <div className="flex-shrink-0 text-center min-w-[45px] sm:min-w-[60px]">
                  <p className="text-xs sm:text-base font-bold text-white font-headline">{appt.start_time.slice(0, 5)}</p>
                  <p className="text-[9px] sm:text-[11px] text-on-surface-variant/60 font-medium">{appt.end_time.slice(0, 5)}</p>
                </div>

                <div className="w-px h-6 sm:h-10 bg-outline-variant/20 flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-base font-semibold text-white truncate">{appt.client_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                    <Scissors className="w-2 h-2 sm:w-3 sm:h-3 text-primary-container/70 flex-shrink-0" />
                    <span className="text-[9px] sm:text-xs text-on-surface-variant font-medium truncate">{appt.service_name}</span>
                  </div>
                </div>

                {/* Status */}
                <div className={cn('flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[8px] sm:text-[11px] font-bold uppercase tracking-wider flex-shrink-0 transition-colors', status.color)}>
                  <StatusIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">{status.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
