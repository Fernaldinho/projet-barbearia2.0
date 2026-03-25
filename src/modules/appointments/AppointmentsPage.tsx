import { useEffect, useState, useCallback, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, ChevronLeft, ChevronRight, Calendar, List, Users2, Search, Filter, MoreVertical, Scissors, Edit, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { AppointmentsList } from './AppointmentsList'
import { AppointmentForm } from './AppointmentForm'
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
} from './appointments.api'
import { getActiveStaff } from '@/modules/staff/staff.api'
import { supabase } from '@/lib/supabase'
import type { Appointment, AppointmentFormData, Staff } from '@/types'
import { cn } from '@/utils/helpers'

export function AppointmentsPage() {
  const { company, features } = useCompany()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [selectedStaffId, setSelectedStaffId] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Modal state
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [preselectedTime, setPreselectedTime] = useState<string | undefined>()

  // Load staff list
  useEffect(() => {
    if (!company?.id) return
    getActiveStaff(company.id).then(setStaffList).catch(console.error)
  }, [company?.id])

  const loadAppointments = useCallback(async () => {
    if (!company?.id) return
    setLoading(true)
    try {
      const data = await getAppointments(company.id, selectedDate, selectedStaffId || undefined)
      setAppointments(data)
    } catch (err) {
      console.error('Error loading appointments:', err)
    } finally {
      setLoading(false)
    }
  }, [company?.id, selectedDate, selectedStaffId])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const handleCreate = async (data: AppointmentFormData, serviceDuration: number) => {
    if (!company?.id) return

    if (features.maxAppointmentsPerMonth !== -1) {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]
  
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .gte('date', firstDay)
        .lte('date', lastDay)
  
      if (!error && count !== null && count >= features.maxAppointmentsPerMonth) {
        toast.error(`Aviso: Seu plano permite apenas ${features.maxAppointmentsPerMonth} agendamentos neste mês. Faça o upgrade para agendar mais.`)
        return
      }
    }

    await createAppointment(company.id, data, serviceDuration)
    toast.success('Agendamento realizado com sucesso!')
    setShowForm(false)
    setPreselectedTime(undefined)
    await loadAppointments()
  }

  const handleUpdate = async (data: AppointmentFormData, serviceDuration: number) => {
    if (!editingAppointment || !company?.id) return
    await updateAppointment(company.id, editingAppointment.id, data, serviceDuration)
    toast.success('Agendamento atualizado!')
    setEditingAppointment(null)
    await loadAppointments()
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateAppointmentStatus(id, status)
      toast.success('Status atualizado!')
      await loadAppointments()
    } catch (err: any) {
      toast.error('Erro ao atualizar status: ' + err.message)
      console.error('Error updating status:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir permanentemente este agendamento?')) return
    try {
      await deleteAppointment(id)
      toast.success('Agendamento excluído.')
      await loadAppointments()
    } catch (err: any) {
      toast.error('Erro ao excluir: ' + err.message)
    }
  }

  const goPrevDay = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }
  const goNextDay = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const goPrevMonth = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1)
    setSelectedDate(prev.toISOString().split('T')[0])
  }
  const goNextMonth = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    setSelectedDate(next.toISOString().split('T')[0])
  }

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    const today = new Date().toISOString().split('T')[0]
    if (dateStr === today) return 'Hoje, ' + d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const filteredAppointments = useMemo(() => {
    if (statusFilter === 'all') return appointments
    return appointments.filter(a => a.status === statusFilter)
  }, [appointments, statusFilter])

  return (
    <div className="animate-fade-in pb-20 mt-8">
      {/* Search Header */}
      <div className="flex items-center px-4 lg:px-0 mb-12">
        <div className="relative flex items-center group flex-1 max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#fbbf24] transition-colors">search</span>
          <input 
            className="w-full bg-[#0e0e0e] border-none py-3.5 pl-12 pr-6 rounded-full text-sm focus:ring-1 focus:ring-[#fbbf24] placeholder:text-zinc-600 transition-all outline-none text-[#E5E2E1]" 
            placeholder="Pesquisar agendamentos ou clientes..." 
            type="text"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="text-left">
            <span className="text-xs font-label text-[#fbbf24] uppercase tracking-[0.3em] font-black block mb-4">Calendário de Gestão</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black text-[#E5E2E1] leading-none tracking-tighter uppercase">Agendamentos</h1>
          </div>
          <button 
            onClick={() => {
              // Note: the true check happens in handleCreate, here we just show a mild warning if they try
              if (features.maxAppointmentsPerMonth !== -1 && appointments.length >= features.maxAppointmentsPerMonth) {
                 alert(`Lembrete: Seu plano tem limite de ${features.maxAppointmentsPerMonth} agendamentos/mês. Podem haver bloqueios caso já tenha atingido o teto.`)
              }
              setShowForm(true)
            }}
            className="bg-[#fbbf24] text-[#402D00] px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all active:scale-95 group shadow-xl shadow-[#fbbf24]/10"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
            NOVO AGENDAMENTO
          </button>
        </div>

        <div className="grid grid-cols-12 gap-12">
          {/* Filters Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-10">
            <div className="bg-[#1C1B1B] rounded-[2rem] p-4 sm:p-6 lg:p-8 border border-white/5 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <Filter className="w-5 h-5 text-[#fbbf24]" />
                <h3 className="font-headline text-xl font-black text-white uppercase tracking-tighter">Filtros</h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'confirmed', label: 'Confirmados' },
                      { id: 'scheduled', label: 'Pendentes' }
                    ].map(status => (
                      <button 
                        key={status.id}
                        onClick={() => setStatusFilter(status.id)}
                        className={cn(
                          "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                          statusFilter === status.id 
                            ? "bg-[#fbbf24] text-[#402D00]" 
                            : "bg-[#0e0e0e] text-zinc-500 hover:text-white"
                        )}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">Profissional</label>
                  <select 
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-white/5 text-xs rounded-xl py-3 px-4 text-zinc-300 focus:ring-1 focus:ring-[#fbbf24]/40 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Todos os Barbeiros</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mini Calendar Visual */}
            <div className="bg-[#1C1B1B] rounded-[2rem] p-4 sm:p-6 lg:p-8 border border-white/5 shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#fbbf24]/5 rounded-full blur-2xl group-hover:bg-[#fbbf24]/10 transition-colors"></div>
              
              {(() => {
                const currentDate = new Date(selectedDate + 'T12:00:00')
                const year = currentDate.getFullYear()
                const month = currentDate.getMonth()
                const daysInMonth = new Date(year, month + 1, 0).getDate()
                const firstDayOfMonth = new Date(year, month, 1).getDay()
                const monthLabel = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

                return (
                  <>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                      <span className="font-black text-white text-sm uppercase tracking-widest">{monthLabel}</span>
                      <div className="flex gap-4">
                        <button onClick={goPrevMonth} className="text-zinc-500 hover:text-[#fbbf24] transition-colors">
                          <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button onClick={goNextMonth} className="text-zinc-500 hover:text-[#fbbf24] transition-colors">
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-zinc-600 font-black mb-4 relative z-10">
                      <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs relative z-10">
                      {[...Array(firstDayOfMonth)].map((_, i) => (
                        <span key={`empty-${i}`} />
                      ))}
                      {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        const isSelected = dateStr === selectedDate
                        return (
                          <span 
                            key={day} 
                            onClick={() => setSelectedDate(dateStr)}
                            className={cn(
                              "py-2 rounded-xl transition-all cursor-pointer font-bold",
                              isSelected
                                ? "bg-[#fbbf24] text-[#402D00]" 
                                : "text-zinc-500 hover:text-white"
                            )}
                          >
                            {day}
                          </span>
                        )
                      })}
                    </div>
                  </>
                )
              })()}
            </div>
          </div>

          {/* Appointments List */}
          <div className="col-span-12 lg:col-span-9">
            <div className="space-y-8">
              {/* Day Header */}
              <div className="flex items-center gap-6">
                <span className="text-lg font-black text-white uppercase tracking-tighter whitespace-nowrap">
                  {formatDisplayDate(selectedDate)}
                </span>
                <div className="flex gap-2">
                  <button onClick={goPrevDay} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button onClick={goNextDay} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-28 bg-[#1C1B1B] rounded-3xl animate-pulse" />
                  ))}
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="bg-[#1C1B1B]/50 rounded-[2.5rem] p-10 sm:p-20 text-center border border-dashed border-white/5">
                  <p className="text-zinc-500 font-medium tracking-wide">Nenhum agendamento para este período.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredAppointments.map((app, index) => (
                    <div 
                      key={app.id} 
                      className={cn(
                        "group bg-[#1C1B1B] rounded-[2rem] p-1 transition-all hover:bg-gradient-to-r hover:from-[#fbbf24]/10 hover:to-transparent border border-white/[0.02]",
                        features.maxAppointmentsPerMonth !== -1 && index >= features.maxAppointmentsPerMonth
                          ? "blur-[4px] opacity-40 select-none pointer-events-none"
                          : ""
                      )}
                    >
                      <div className="bg-[#1C1B1B] rounded-[1.9rem] p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between group-hover:translate-x-2 transition-transform duration-500 gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-10 w-full md:w-auto">
                          <div className="text-center min-w-[80px]">
                            <p className="text-2xl sm:text-3xl font-headline font-black text-white tracking-tighter">{app.start_time.slice(0, 5)}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mt-1">45 min</p>
                          </div>
                          <div className="hidden sm:block w-[1px] h-12 bg-white/5"></div>
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0e0e0e] overflow-hidden border border-white/5 group-hover:border-[#fbbf24]/30 transition-all flex-shrink-0">
                              {app.client?.name ? (
                                <div className="w-full h-full flex items-center justify-center bg-[#1c1c1c] text-[#fbbf24] font-black text-lg shadow-inner">
                                  {app.client.name.substring(0, 2).toUpperCase()}
                                </div>
                              ) : (
                                <span className="material-symbols-outlined text-zinc-700 m-auto">person</span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-black text-lg sm:text-xl text-white tracking-tight group-hover:text-[#fbbf24] transition-colors capitalize">{app.client?.name || 'Cliente'}</h4>
                              <p className="text-[10px] sm:text-xs text-[#D3C5AC]/60 uppercase tracking-widest font-bold mt-1">{app.service?.name || 'Serviço Premium'}</p>
                              {app.status === 'cancelled' && app.cancellation_reason && (
                                <p className="text-[10px] text-red-500/80 font-medium italic mt-2 bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10 inline-block">
                                  Motivo: {app.cancellation_reason}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-16 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                          <div className="hidden xl:block">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black mb-2">Especialista</p>
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center group-hover:bg-[#fbbf24]/20 transition-all">
                                <Scissors className="w-3 h-3 text-[#fbbf24]" />
                              </div>
                              <span className="text-sm font-bold text-white/80">{app.staff?.name || 'Algum prof'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-8">
                            <span className={cn(
                              "px-3 py-1.5 sm:px-5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg",
                              app.status === 'confirmed' ? "bg-blue-500/10 text-blue-400" : 
                              app.status === 'completed' ? "bg-emerald-500/10 text-emerald-400" :
                              app.status === 'scheduled' ? "bg-[#fbbf24]/10 text-[#fbbf24]" :
                              "bg-red-500/10 text-red-500"
                            )}>
                              {app.status === 'confirmed' ? 'Confirmado' : 
                               app.status === 'completed' ? 'Concluído' :
                               app.status === 'scheduled' ? 'Agendado' : 'Cancelado'}
                            </span>
                            <div className="relative">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === app.id ? null : app.id); }}
                                className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all text-zinc-500 hover:text-white"
                              >
                                <MoreVertical className="w-6 h-6" />
                              </button>
                              
                              {openMenuId === app.id && (
                                <div className="absolute top-14 right-0 mt-2 w-48 bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-fade-in origin-top-right">
                                  <button onClick={(e) => { e.stopPropagation(); setEditingAppointment(app); setOpenMenuId(null); }} className="w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-[#E5E2E1] hover:bg-white/5 hover:text-[#fbbf24] transition-all flex items-center gap-3">
                                    <Edit className="w-4 h-4" /> Editar
                                  </button>
                                  {app.status === 'scheduled' && (
                                    <button onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, 'confirmed'); setOpenMenuId(null); }} className="w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-[#E5E2E1] hover:bg-white/5 hover:text-emerald-400 transition-all flex items-center gap-3">
                                      <CheckCircle className="w-4 h-4" /> Confirmar
                                    </button>
                                  )}
                                  {app.status === 'confirmed' && (
                                    <button onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, 'completed'); setOpenMenuId(null); }} className="w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-[#E5E2E1] hover:bg-white/5 hover:text-blue-400 transition-all flex items-center gap-3">
                                      <CheckCircle className="w-4 h-4" /> Concluir
                                    </button>
                                  )}
                                  {(app.status === 'scheduled' || app.status === 'confirmed') && (
                                    <button onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, 'cancelled'); setOpenMenuId(null); }} className="w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5 hover:text-red-500 transition-all flex items-center gap-3 border-t border-white/5">
                                      <XCircle className="w-4 h-4" /> Cancelar
                                    </button>
                                  )}
                                  <button onClick={(e) => { e.stopPropagation(); handleDelete(app.id); setOpenMenuId(null); }} className="w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5 hover:text-red-500 transition-all flex items-center gap-3 border-t border-white/5">
                                    <Trash2 className="w-4 h-4" /> Excluir
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Analytics Summary */}
      <div className="fixed bottom-6 right-6 sm:bottom-12 sm:right-12 z-20">
        <div className="bg-[#1C1B1B]/90 backdrop-blur-2xl px-4 py-3 sm:px-8 sm:py-5 rounded-2xl sm:rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-6 sm:gap-10 hover:scale-105 transition-transform cursor-pointer">
          <div>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black mb-1">Status Hoje</p>
            <p className="text-lg sm:text-2xl font-headline font-black text-[#fbbf24] tracking-tighter text-nowrap">{appointments.length} Agendamentos</p>
          </div>
          <div className="w-[1px] h-8 sm:h-10 bg-white/10"></div>
          <div>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black mb-1">Ocupação</p>
            <div className="flex items-center gap-2 sm:gap-3">
              <p className="text-xl sm:text-2xl font-headline font-black text-white tracking-tighter">84%</p>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <AppointmentForm
          preselectedDate={selectedDate}
          preselectedTime={preselectedTime}
          preselectedStaffId={selectedStaffId || undefined}
          onSubmit={handleCreate}
          onClose={() => { setShowForm(false); setPreselectedTime(undefined) }}
        />
      )}

      {editingAppointment && (
        <AppointmentForm
          initialData={editingAppointment}
          onSubmit={handleUpdate}
          onClose={() => setEditingAppointment(null)}
        />
      )}
    </div>
  )
}
