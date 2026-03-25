import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyAppointmentsPoint } from './dashboard.api'

interface AppointmentsChartProps {
  data: DailyAppointmentsPoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-surface border border-border-heavy rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="text-[10px] font-bold text-text-caption uppercase tracking-widest mb-2">{label}</p>
      {payload.map((item: any) => (
        <div key={item.name} className="flex items-center justify-between gap-4 mt-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
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
        <div className="flex items-center justify-center h-full text-text-muted/40 text-sm italic">
          Sem dados para o período
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
              allowDecimals={false} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar 
              dataKey="completed" 
              name="completed" 
              fill="#ffe2ab" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={12} 
              animationDuration={1500}
            />
            <Bar 
              dataKey="cancelled" 
              name="cancelled" 
              fill="#737373" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={12} 
              opacity={0.2}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 justify-start">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] font-bold text-text-caption uppercase tracking-widest">Concluídos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-text-caption opacity-20" />
          <span className="text-[10px] font-bold text-text-caption uppercase tracking-widest">Cancelados</span>
        </div>
      </div>
    </div>
  )
}
