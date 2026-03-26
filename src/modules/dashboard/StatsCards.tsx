import { CalendarCheck, UserPlus, DollarSign, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { DashboardMetrics } from './dashboard.api'

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface CardConfig {
  key: keyof DashboardMetrics
  title: string
  icon: LucideIcon
  format: (v: number) => string
}

const cards: CardConfig[] = [
  {
    key: 'appointmentsToday',
    title: 'Agendamentos hoje',
    icon: CalendarCheck,
    format: (v) => v.toString(),
  },
  {
    key: 'newClientsThisMonth',
    title: 'Novos clientes (mês)',
    icon: UserPlus,
    format: (v) => v.toString(),
  },
  {
    key: 'monthlyRevenue',
    title: 'Faturamento do mês',
    icon: DollarSign,
    format: (v) => formatter.format(v),
  },
  {
    key: 'projectedRevenue',
    title: 'Faturamento previsto',
    icon: DollarSign,
    format: (v) => formatter.format(v),
  },
  {
    key: 'attendanceRate',
    title: 'Comparecimento',
    icon: TrendingUp,
    format: (v) => `${v}%`,
  },
]

interface StatsCardsProps {
  metrics: DashboardMetrics
}

export function StatsCards({ metrics }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon
        const value = metrics[card.key] as number

        return (
          <div 
            key={card.key} 
            className="p-3.5 sm:p-5 lg:p-6 rounded-2xl bg-surface-container-low transition-all hover:bg-surface-container-highest group"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary-container/10 group-hover:bg-primary-container/20 transition-colors">
                <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0 text-primary-container" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1 font-headline tracking-tighter truncate" title={card.format(value)}>
              {card.format(value)}
            </p>
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-on-surface-variant/70 uppercase tracking-widest truncate">
              {card.title}
            </p>
          </div>
        )
      })}
    </div>
  )
}
