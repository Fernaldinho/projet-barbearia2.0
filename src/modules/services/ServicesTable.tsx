import type { Service } from '@/types'
import { formatCurrency, cn } from '@/utils/helpers'
import { Edit, Trash2, Clock, Scissors, Activity } from 'lucide-react'

interface ServicesTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <div className="p-16 text-center rounded-[2rem] bg-surface-container-low border border-outline-variant/5">
        <div className="w-20 h-20 bg-surface-container-highest/30 rounded-full flex items-center justify-center mx-auto mb-6">
           <Scissors className="w-10 h-10 text-on-surface-variant/20" />
        </div>
        <p className="text-white text-xl font-bold font-headline mb-2">Nenhum serviço cadastrado</p>
        <p className="text-on-surface-variant text-sm max-w-xs mx-auto">Comece adicionando seu primeiro serviço para compor seu catálogo.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div 
          key={service.id} 
          className="group relative bg-surface-container-low border border-outline-variant/5 hover:bg-surface-container-highest/50 transition-all duration-500 rounded-[2.5rem] p-8"
        >
          {/* Header Action & Icon */}
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner">
              <Scissors className="w-6 h-6 text-primary-container" />
            </div>

            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all scale-90",
              service.is_active 
                ? "bg-primary-container/5 border-primary-container/20 text-primary-container" 
                : "bg-white/5 border-white/10 text-on-surface-variant/40"
            )}>
              <Activity className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {service.is_active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          {/* Service Info */}
          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-bold text-white font-headline tracking-tight uppercase group-hover:text-primary-container transition-colors line-clamp-1">
              {service.name}
            </h3>
            <p className="text-sm text-on-surface-variant/50 font-medium leading-relaxed line-clamp-2 min-h-[40px]">
              {service.description || 'Nenhuma descrição detalhada fornecida.'}
            </p>
          </div>

          {/* Footer Metrics & Actions */}
          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em] mb-1">Tempo</span>
                <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                  <Clock className="w-3 h-3 text-primary-container/40" />
                  {service.duration} min
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em] mb-1">Investimento</span>
                <p className="text-white font-bold text-sm tabular-nums">
                  {formatCurrency(service.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
              <button
                onClick={() => onEdit(service)}
                className="w-10 h-10 rounded-xl bg-surface-container-highest text-white hover:text-primary-container transition-all flex items-center justify-center shadow-sm"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className="w-10 h-10 rounded-xl bg-surface-container-highest text-danger-500 hover:bg-danger-500/10 transition-all flex items-center justify-center shadow-sm"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


