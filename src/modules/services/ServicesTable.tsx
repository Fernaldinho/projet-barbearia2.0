import type { Service } from '@/types'
import { formatCurrency } from '@/utils/helpers'
import { Edit, Trash2, Clock, Scissors, Activity } from 'lucide-react'

interface ServicesTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <div className="p-16 text-center rounded-3xl bg-surface-container-low">
        <div className="w-20 h-20 bg-surface-container-highest/30 rounded-full flex items-center justify-center mx-auto mb-6">
           <Scissors className="w-10 h-10 text-on-surface-variant/20" />
        </div>
        <p className="text-white text-xl font-bold font-headline mb-2">Nenhum serviço cadastrado</p>
        <p className="text-on-surface-variant text-sm max-w-xs mx-auto">Comece adicionando seu primeiro serviço para compor seu catálogo premium.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div 
          key={service.id} 
          className="group relative bg-surface-container-low hover:bg-surface-container-highest transition-all duration-300 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden"
        >
          {/* Status Indicator */}
          <div className="absolute top-0 right-0 p-6">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              service.is_active 
                ? 'bg-primary-container/10 text-primary-container' 
                : 'bg-on-surface-variant/10 text-on-surface-variant/40'
            }`}>
              <Activity className="w-3 h-3" />
              {service.is_active ? 'Ativo' : 'Inativo'}
            </div>
          </div>

          <div>
            <div className="w-14 h-14 bg-primary-container/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
               <Scissors className="w-7 h-7 text-primary-container" />
            </div>
            
            <h3 className="text-2xl font-bold text-white font-headline group-hover:text-primary-container transition-colors">
              {service.name}
            </h3>
            
            {service.description && (
              <p className="text-on-surface-variant text-sm mt-3 leading-relaxed line-clamp-2">
                {service.description}
              </p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-on-surface-variant/60">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{service.duration} MIN</span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {formatCurrency(service.price)}
              </p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
              <button
                onClick={() => onEdit(service)}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all"
                title="Editar"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className="w-12 h-12 rounded-full bg-danger-500/10 hover:bg-danger-500/20 text-danger-500 flex items-center justify-center transition-all"
                title="Excluir"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
