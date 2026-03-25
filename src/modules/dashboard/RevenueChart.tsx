import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/utils/helpers'
import type { DailyRevenuePoint } from './dashboard.api'

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface RevenueChartProps {
  data: DailyRevenuePoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-container-highest border border-outline-variant/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-6">
           <span className="text-xs font-medium text-white/60">
             {p.name === 'revenue' ? 'Faturamento' : 'Previsto'}
           </span>
           <span className={cn("text-sm font-bold", p.name === 'revenue' ? "text-primary-container" : "text-emerald-500")}>
             {formatter.format(p.value)}
           </span>
        </div>
      ))}
    </div>
  )
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[250px] w-full">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-on-surface-variant/40 text-sm italic">
          Sem dados para o período selecionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 11, fill: 'var(--color-on-surface-variant)', fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'var(--color-on-surface-variant)', fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(v) => `R$ ${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-outline-variant)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="projected"
              name="projected"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#projectedGradient)"
              animationDuration={1500}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke="#FBBF24"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              animationDuration={1500}
              dot={false}
              activeDot={{ r: 6, stroke: '#131313', strokeWidth: 2, fill: '#FBBF24' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
