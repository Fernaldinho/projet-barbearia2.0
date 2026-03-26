import { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Search, CalendarOff } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { BlockedTimesTable } from './BlockedTimesTable'
import { BlockedTimesForm } from './BlockedTimesForm'
import {
  getBlockedTimes,
  createBlockedTime,
  updateBlockedTime,
  deleteBlockedTime,
} from './blocked-times.api'
import type { BlockedTime } from '@/types'
import type { BlockedTimeFormData } from './blocked-times.api'

export function BlockedTimesPage() {
  const { company } = useCompany()
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<BlockedTime | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadBlockedTimes = async () => {
    if (!company?.id) return
    try {
      const data = await getBlockedTimes(company.id)
      setBlockedTimes(data)
    } catch (err) {
      console.error('Error loading blocked times:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlockedTimes()
  }, [company?.id])

  const handleCreate = async (data: BlockedTimeFormData) => {
    if (!company?.id) return
    await createBlockedTime(company.id, data)
    setShowForm(false)
    await loadBlockedTimes()
  }

  const handleUpdate = async (data: BlockedTimeFormData) => {
    if (!editingItem || !company?.id) return
    await updateBlockedTime(company.id, editingItem.id, data)
    setEditingItem(null)
    await loadBlockedTimes()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este bloqueio?')) return
    try {
      await deleteBlockedTime(id)
      toast.success('Bloqueio excluído com sucesso!')
      await loadBlockedTimes()
    } catch (err: any) {
      toast.error('Erro ao excluir: ' + err.message)
    }
  }

  const filteredItems = useMemo(() => {
    if (!searchTerm) return blockedTimes
    const lower = searchTerm.toLowerCase()
    return blockedTimes.filter(
      (item) =>
        item.date.includes(searchTerm) ||
        (item.reason && item.reason.toLowerCase().includes(lower))
    )
  }, [blockedTimes, searchTerm])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tight">
            Bloqueios de Horário
          </h1>
          <p className="text-dark-400 text-lg max-w-md leading-relaxed">
            Gestão cirúrgica de indisponibilidade para garantir a excelência do atendimento.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-auto overflow-hidden rounded-full transition-all focus-within:ring-1 focus-within:ring-primary-container/30">
            <Search className="w-5 h-5 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
            <input
              type="text"
              placeholder="Buscar por data ou motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 bg-surface-container-low border-none h-12 pl-12 pr-6 text-sm text-on-surface placeholder:text-dark-500 focus:outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-8 h-12 bg-primary-container text-on-primary font-bold rounded-full transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary-container/10"
          >
            <Plus className="w-5 h-5" />
            Novo Bloqueio
          </button>
        </div>
      </div>


      {/* Content */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <BlockedTimesTable
          blockedTimes={filteredItems}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      {showForm && (
        <BlockedTimesForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}
      {editingItem && (
        <BlockedTimesForm
          initialData={editingItem}
          onSubmit={handleUpdate}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  )
}
