import { CalendarCheck, UserPlus, DollarSign, TrendingUp, type LucideIcon } from 'lucide-react'
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
    title: 'AGENDAMENTOS HOJE',
    icon: CalendarCheck,
    format: (v) => v.toString(),
  },
  {
    key: 'newClientsThisMonth',
    title: 'NOVOS CLIENTES',
    icon: UserPlus,
    format: (v) => v.toString(),
  },
  {
    key: 'monthlyRevenue',
    title: 'FATURAMENTO MENSAL',
    icon: DollarSign,
    format: (v) => formatter.format(v),
  },
  {
    key: 'attendanceRate',
    title: 'TAXA DE FIDELIZAÇÃO',
    icon: TrendingUp,
    format: (v) => `${v}%`,
  },
]

interface StatsCardsProps {
  metrics: DashboardMetrics
}

export function StatsCards({ metrics }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((card) => {
        const Icon = card.icon
        const value = metrics[card.key] as number

        return (
          <div 
            key={card.key} 
            className="p-8 rounded-[2rem] bg-surface-container-low hover:bg-surface-container-highest transition-all duration-500 group shadow-2xl hover:shadow-primary-container/[0.02] border border-outline-variant/5"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-primary-container/10 group-hover:bg-primary-container/20 group-hover:scale-110 transition-all duration-500 shadow-inner">
                <Icon className="w-7 h-7 shrink-0 text-primary-container" />
              </div>
              <div className="h-1 w-12 bg-white/5 rounded-full" />
            </div>
            
            <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-2 px-1">
              {card.title}
            </p>
            
            <p className="text-4xl lg:text-5xl font-bold text-white font-headline tracking-tighter transition-transform group-hover:translate-x-1 duration-500 tabular-nums">
              {card.format(value)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

