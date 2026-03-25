import type { TopServiceItem } from './dashboard.api'
import { Scissors } from 'lucide-react'

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface TopServicesProps {
  data: TopServiceItem[]
}

export function TopServices({ data }: TopServicesProps) {
  const maxCount = data.length > 0 ? (data as any)[0].count : 1

  return (
    <div className="card-premium">
      <h3 className="mb-6 uppercase tracking-widest text-[11px] font-bold text-text-caption">Ranking de Serviços</h3>
      {data.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-white/5 bg-white/2 text-text-muted/40 text-sm italic">
          Nenhum dado para o período
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((item, i) => {
            const barWidth = Math.max((item.count / maxCount) * 100, 5)

            return (
              <div key={item.name} className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-black text-primary/30 w-6 flex-shrink-0 group-hover:text-primary/60 transition-colors">0{i + 1}</span>
                    <span className="text-sm font-bold text-white truncate font-headline group-hover:translate-x-1 transition-transform">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-[10px] md:text-xs font-black flex-shrink-0 uppercase tracking-widest">
                    <span className="text-text-muted/40 group-hover:text-text-muted transition-colors">{item.count}X</span>
                    <span className="text-primary group-hover:scale-110 transition-transform">{formatter.format(item.revenue)}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/2 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
