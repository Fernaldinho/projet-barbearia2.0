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
    key: 'attendanceRate',
    title: 'Taxa de comparecimento',
    icon: TrendingUp,
    format: (v) => `${v}%`,
  },
]

interface StatsCardsProps {
  metrics: DashboardMetrics
}

export function StatsCards({ metrics }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
      {cards.map((card) => {
        const Icon = card.icon
        const value = metrics[card.key] as number

        return (
          <div 
            key={card.key} 
            className="p-[24px] rounded-2xl bg-surface-container-low transition-all hover:bg-surface-container-highest group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary-container/10 group-hover:bg-primary-container/20 transition-colors">
                <Icon className="w-5 h-5 shrink-0 text-primary-container" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1 font-headline tracking-tight">
              {card.format(value)}
            </p>
            <p className="text-sm font-medium text-on-surface-variant/80 uppercase tracking-wider">
              {card.title}
            </p>
          </div>
        )
      })}
    </div>
  )
}
