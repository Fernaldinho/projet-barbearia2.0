import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyAppointmentsPoint } from './dashboard.api'

interface AppointmentsChartProps {
  data: DailyAppointmentsPoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-container-highest border border-outline-variant/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider mb-2">{label}</p>
      {payload.map((item: any) => (
        <div key={item.name} className="flex items-center justify-between gap-4 mt-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium text-white">
              {item.name === 'completed' ? 'Concluídos' : 'Cancelados'}
            </span>
          </div>
          <span className="text-sm font-bold text-white">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function AppointmentsChart({ data }: AppointmentsChartProps) {
  return (
    <div className="h-[200px] w-full">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-on-surface-variant/40 text-sm italic">
          Sem dados para o período
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
              allowDecimals={false} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar 
              dataKey="completed" 
              name="completed" 
              fill="#FBBF24" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={16} 
              animationDuration={1500}
            />
            <Bar 
              dataKey="cancelled" 
              name="cancelled" 
              fill="var(--color-outline-variant)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={16} 
              opacity={0.3}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 justify-start">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Concluídos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-outline-variant opacity-30" />
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Cancelados</span>
        </div>
      </div>
    </div>
  )
}
