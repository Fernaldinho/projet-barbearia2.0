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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cards.map((card) => {
        const Icon = card.icon
        const value = metrics[card.key] as number

        return (
          <div 
            key={card.key} 
            className="group card-premium p-6 hover:bg-white/[0.02] transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 group-hover:bg-primary/20 transition-all">
                <Icon className="w-5 h-5 shrink-0 text-primary" />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-text-caption opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
            
            <p className="text-2xl md:text-2xl font-headline font-bold text-white mb-1 tracking-tight">
              {card.format(value)}
            </p>
            
            <h4 className="text-[10px] font-bold text-text-caption uppercase tracking-[0.2em]">
              {card.title}
            </h4>
          </div>
        )
      })}
    </div>
  )
}
