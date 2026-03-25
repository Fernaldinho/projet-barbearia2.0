import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyRevenuePoint } from './dashboard.api'

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface RevenueChartProps {
  data: DailyRevenuePoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-surface border border-border-heavy rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="text-[10px] font-bold text-text-caption uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-bold text-primary">{formatter.format(payload[0].value)}</p>
    </div>
  )
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[250px] w-full">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-text-muted/40 text-sm italic">
          Sem dados para o período selecionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffe2ab" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ffe2ab" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 10, fill: '#737373', fontWeight: 600 }} 
              axisLine={false} 
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#737373', fontWeight: 600 }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(v) => `R$ ${v}`}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} 
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ffe2ab"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              animationDuration={1500}
              dot={false}
              activeDot={{ r: 5, stroke: '#000000', strokeWidth: 2, fill: '#ffe2ab' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
