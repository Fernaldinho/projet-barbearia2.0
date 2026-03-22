import type { TopServiceItem } from './dashboard.api'
import { Scissors } from 'lucide-react'

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface TopServicesProps {
  data: TopServiceItem[]
}

export function TopServices({ data }: TopServicesProps) {
  const maxCount = data.length > 0 ? (data as any)[0].count : 1

  return (
    <div className="p-[24px] rounded-2xl bg-surface-container-low">
      <h3 className="!mb-[24px] font-headline text-lg text-white">Serviços Mais Procurados</h3>
      {data.length === 0 ? (
        <div className="text-center py-10 text-on-surface-variant/50 text-sm italic">
          Nenhum dado para o período
        </div>
      ) : (
        <div className="space-y-[20px]">
          {data.map((item, i) => {
            const barWidth = Math.max((item.count / maxCount) * 100, 8)

            return (
              <div key={item.name} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-on-surface-variant/40 w-5 flex-shrink-0">#{i + 1}</span>
                    <span className="text-sm font-bold text-white truncate font-headline">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold flex-shrink-0">
                    <span className="text-on-surface-variant/60">{item.count}x</span>
                    <span className="text-primary-container">{formatter.format(item.revenue)}</span>
                  </div>
                </div>
                <div className="h-2 bg-surface-container-highest/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-container to-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,191,36,0.2)]"
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
