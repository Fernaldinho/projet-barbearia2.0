import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, UserPlus, Star, MoreHorizontal, CheckCircle2, AlertCircle } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { StaffForm } from './StaffForm'
import { getStaff, createStaff, updateStaff, toggleStaffActive, deleteStaff } from './staff.api'
import type { Staff, StaffFormData } from '@/types'
import { cn } from '@/utils/helpers'

export function StaffPage() {
  const { company } = useCompany()
  const [staffList, setStaffList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)

  const load = useCallback(async () => {
    if (!company?.id) return
    setLoading(true)
    try { 
      const data = await getStaff(company.id)
      setStaffList(data) 
    }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [company?.id])

  useEffect(() => { load() }, [load])

  const handleCreate = async (data: StaffFormData) => {
    if (!company?.id) return
    await createStaff(company.id, data)
    toast.success('Profissional cadastrado!')
    setShowForm(false)
    await load()
  }

  const handleUpdate = async (data: StaffFormData) => {
    if (!editing) return
    await updateStaff(editing.id, data)
    toast.success('Perfil atualizado!')
    setEditing(null)
    await load()
  }

  const handleToggle = async (id: string, active: boolean) => {
    await toggleStaffActive(id, !active)
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este profissional? Os agendamentos vinculados não serão apagados.')) return
    try {
      await deleteStaff(id)
      toast.success('Profissional removido.')
      await load()
    } catch (err: any) {
      toast.error('Erro ao remover: ' + err.message)
    }
  }

  return (
    <div className="animate-fade-in pb-20 space-y-16 mt-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 px-4 lg:px-0">
        <div className="space-y-4">
          <span className="text-xs tracking-[0.3em] uppercase font-label text-[#fbbf24] font-bold block">Equipe de Elite</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter text-[#E5E2E1] uppercase leading-none">Profissionais</h1>
          <p className="text-[#D3C5AC] text-lg font-light leading-relaxed max-w-2xl">
            Gerencie sua equipe de especialistas com visão 360°. Acompanhe performance, horários e avaliações.
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="bg-[#fbbf24] text-[#402D00] font-headline font-bold px-8 py-4 rounded-full flex items-center gap-3 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all active:scale-95 group"
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
          NOVO PROFISSIONAL
        </button>
      </div>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-4 lg:px-0">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="bg-[#1c1b1b] rounded-[2rem] h-[240px] animate-pulse" />
          ))
        ) : staffList.length === 0 ? (
          <div className="xl:col-span-2 flex flex-col items-center justify-center py-20 bg-[#1c1b1b]/50 rounded-[2rem] border border-dashed border-[#4F4633]/20">
            <UserPlus className="w-12 h-12 text-[#4F4633]/40 mb-4" />
            <p className="text-[#D3C5AC]/60 font-medium">Nenhum profissional cadastrado.</p>
          </div>
        ) : (
          staffList.map((s) => (
            <div 
              key={s.id} 
              className={cn(
                "bg-[#1C1B1B] rounded-[2rem] p-4 sm:p-6 lg:p-8 group hover:bg-[#201F1F] transition-all duration-500 flex flex-col sm:flex-row items-start lg:items-center gap-6 lg:gap-8 border border-transparent hover:border-[#4F4633]/20 cursor-pointer relative",
                !s.active && "opacity-60"
              )}
              onClick={() => setEditing(s)}
            >
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#353534] flex items-center justify-center relative shadow-inner">
                  {s.avatar_url ? (
                    <img src={s.avatar_url} alt={s.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <span className="text-4xl font-headline font-black text-[#fbbf24]/50">{s.name.charAt(0)}</span>
                  )}
                </div>
                <div className={cn(
                  "absolute -bottom-2 -right-2 font-bold text-[10px] px-3 py-1 rounded-lg uppercase font-label tracking-tighter",
                  s.active ? "bg-[#fbbf24] text-[#402D00]" : "bg-zinc-600 text-white"
                )}>
                  {s.active ? 'Ativo' : 'Folga'}
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="truncate pr-4">
                    <h3 className="text-2xl font-bold font-headline text-[#E5E2E1] truncate group-hover:text-[#fbbf24] transition-colors">{s.name}</h3>
                    <p className="text-[#fbbf24]/60 text-xs font-label uppercase tracking-[0.2em] mt-1">{s.role || 'Barbeiro Especialista'}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#fbbf24]">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-headline font-black text-lg">
                      {s.reviews && s.reviews.length > 0 
                        ? (s.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / s.reviews.length).toFixed(1)
                        : '4.9'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#0e0e0e] px-4 py-3 rounded-2xl flex flex-col flex-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Agendamentos</span>
                    <span className="text-sm font-black text-[#E5E2E1]">{s.appointments?.filter((a:any) => new Date(a.date).getMonth() === new Date().getMonth()).length || 0}/mês</span>
                  </div>
                  <div className="bg-[#0e0e0e] px-4 py-3 rounded-2xl flex flex-col flex-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Especialidade</span>
                    <span className="text-sm font-black text-[#E5E2E1]">Master Fade</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                      className="p-2 rounded-xl text-zinc-600 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>

                  {/* Status Toggle (Stitch Style) */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); handleToggle(s.id, s.active); }}
                    className={cn(
                      "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 cursor-pointer shadow-inner",
                      s.active ? "bg-[#fbbf24]" : "bg-[#353534]"
                    )}
                  >
                    <span className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-[#1c1b1b] transition-transform duration-300 shadow",
                      s.active ? "translate-x-6" : "translate-x-1"
                    )} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Invite Card */}
        <div 
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-[#4F4633]/20 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center gap-6 hover:border-[#fbbf24]/40 hover:bg-[#fbbf24]/5 transition-all duration-300 cursor-pointer group"
        >
          <div className="w-20 h-20 rounded-full bg-[#1c1b1b] flex items-center justify-center text-zinc-600 group-hover:text-[#fbbf24] transition-all duration-500 shadow-inner group-hover:scale-110">
            <span className="material-symbols-outlined text-4xl">person_add</span>
          </div>
          <div>
            <p className="font-bold font-headline text-2xl text-[#E5E2E1]">Recrutar talento</p>
            <p className="text-zinc-500 text-sm font-medium mt-2">Expanda sua equipe com novos especialistas</p>
          </div>
        </div>
      </div>

      {/* Performance Summary Section */}
      <div className="px-4 lg:px-0">
        <section className="bg-[#1C1B1B] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
          <div className="p-6 sm:p-10 border-b border-[#4F4633]/10 flex justify-between items-center">
            <h2 className="text-2xl sm:text-3xl font-black font-headline uppercase tracking-tighter text-[#E5E2E1]">Fatos & Performance</h2>
            <button className="text-zinc-600 hover:text-white transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-[#D3C5AC]/40 font-bold bg-[#131313]/30">
                  <th className="px-4 sm:px-6 lg:px-10 py-4 lg:py-6 font-medium">Profissional</th>
                  <th className="px-4 sm:px-6 lg:px-10 py-4 lg:py-6 font-medium">Agendamentos (Mês)</th>
                  <th className="px-4 sm:px-6 lg:px-10 py-4 lg:py-6 font-medium">Concluídos</th>
                  <th className="px-4 sm:px-6 lg:px-10 py-4 lg:py-6 font-medium">Geração de Receita</th>
                  <th className="px-4 sm:px-6 lg:px-10 py-4 lg:py-6 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4F4633]/10">
                {staffList.map((s) => {
                  const currentMonth = new Date().getMonth()
                  const currentYear = new Date().getFullYear()
                  const apptsDateFiltered = (s.appointments || []).filter((a: any) => {
                    const d = new Date(a.date)
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
                  })
                  
                  const totalAppts = apptsDateFiltered.length
                  const completedAppts = apptsDateFiltered.filter((a: any) => a.status === 'completed' || a.status === 'confirmed').length
                  const receita = apptsDateFiltered
                    .filter((a: any) => a.status === 'completed' || a.status === 'confirmed')
                    .reduce((acc: number, a: any) => acc + (a.service?.price || 0), 0)

                  return (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#0e0e0e] flex items-center justify-center text-sm font-black text-[#fbbf24] border border-white/5 shadow-inner">
                            {s.name.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-base font-bold text-[#E5E2E1] group-hover:text-[#fbbf24] transition-colors">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 text-base font-black text-[#E5E2E1]">{totalAppts}</td>
                      <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 text-base font-black text-[#E5E2E1]">{completedAppts}</td>
                      <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 text-base font-black text-[#fbbf24]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receita)}
                      </td>
                      <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                            s.active ? "bg-emerald-500" : "bg-zinc-600"
                          )} />
                          <span className="text-xs uppercase font-bold tracking-widest text-[#D3C5AC]/60">
                            {s.active ? 'Disponível' : 'Ausente'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showForm && <StaffForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editing && <StaffForm initialData={editing} onSubmit={handleUpdate} onClose={() => setEditing(null)} />}
    </div>
  )
}
