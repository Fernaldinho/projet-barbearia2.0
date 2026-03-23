import type { Service } from '@/types'
import { formatCurrency } from '@/utils/helpers'
import { Edit, Trash2, Clock, Scissors, Activity, Star } from 'lucide-react'

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
        <p className="text-on-surface-variant text-sm max-w-xs mx-auto">Comece adicionando seu primeiro serviço para compor seu catálogo premium.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => {
        const isBestseller = service.name.toLowerCase().includes('signature') || service.name.toLowerCase().includes('combo')
        
        return (
          <div 
            key={service.id} 
            className={`group relative bg-surface-container-low hover:bg-surface-container-highest transition-all duration-500 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-primary-container/5 ${
              isBestseller ? 'ring-1 ring-primary-container/20' : ''
            }`}
          >
            {/* BESTSELLER Badge */}
            {isBestseller && (
              <div className="absolute top-0 left-0 pt-6 px-10">
                <div className="bg-primary-container text-on-primary-fixed px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20">
                  BESTSELLER
                </div>
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-0 right-0 p-6">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
                service.is_active 
                  ? 'bg-primary-container/10 text-primary-container' 
                  : 'bg-on-surface-variant/10 text-on-surface-variant/30'
              }`}>
                <Activity className="w-3 h-3" />
                {service.is_active ? 'Ativo' : 'Inativo'}
              </div>
            </div>

            <div className="mt-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ${
                isBestseller ? 'bg-primary-container text-on-primary-fixed' : 'bg-surface-container-highest/50 text-primary-container shadow-inner'
              }`}>
                 {isBestseller ? <Star className="w-8 h-8 fill-current" /> : <Scissors className="w-8 h-8" />}
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white font-headline group-hover:text-primary-container transition-colors tracking-tight">
                {service.name}
              </h3>
              
              {service.description && (
                <p className="text-on-surface-variant/70 text-sm mt-4 leading-relaxed line-clamp-2 font-medium">
                  {service.description}
                </p>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-outline-variant/10 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-on-surface-variant/40">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{service.duration} MIN</span>
                </div>
                <p className="text-3xl font-bold text-white tracking-tighter tabular-nums">
                  {formatCurrency(service.price)}
                </p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                <button
                  onClick={() => onEdit(service)}
                  className="w-11 h-11 rounded-full bg-surface-container-high border border-outline-variant/20 hover:border-primary-container/40 text-white flex items-center justify-center transition-all"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(service.id)}
                  className="w-11 h-11 rounded-full bg-danger-500/10 border border-danger-500/20 hover:bg-danger-500/20 text-danger-500 flex items-center justify-center transition-all"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

