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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        const value = metrics[card.key] as number

        return (
          <div 
            key={card.key} 
            className="card-premium hover:bg-white/5 group border-white/5 active:scale-[0.98] cursor-default"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                <Icon className="w-6 h-6 shrink-0 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-1 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="w-4 h-4 text-primary/50" />
              </div>
            </div>
            
            <p className="text-3xl md:text-4xl font-headline font-bold text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
              {card.format(value)}
            </p>
            
            <p className="text-[10px] md:text-xs font-black text-text-muted/60 uppercase tracking-[0.2em] leading-none">
              {card.title}
            </p>
          </div>
        )
      })}
    </div>
  )
}
