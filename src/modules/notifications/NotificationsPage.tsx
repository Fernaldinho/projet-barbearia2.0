import { useState, useEffect, useCallback } from 'react'
import { Bell, CheckCircle, AlertTriangle, MessageSquare, Trash2, Check, Filter, Calendar, X, MoreVertical } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCompany } from '@/contexts/CompanyContext'
import { supabase } from '@/lib/supabase'
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } from './notifications.api'
import { cn } from '@/utils/helpers'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'review' | 'cancelled'
  read: boolean
  created_at: string
}

export function NotificationsPage() {
  const { company } = useCompany()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const loadNotifications = useCallback(async () => {
    if (!company?.id) return
    setLoading(true)
    try {
      const data = await getNotifications(company.id)
      setNotifications(data)
    } catch (err: any) {
      toast.error('Erro ao carregar notificações')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [company?.id])

  useEffect(() => {
    loadNotifications()

    // Subscribe to new notifications
    if (!company?.id) return
    const channel = supabase
      .channel('notifications_page')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `company_id=eq.${company.id}`
      }, () => {
        loadNotifications()
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [company?.id, loadNotifications])

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      toast.error('Erro ao marcar como lida')
    }
  }

  const handleMarkAllRead = async () => {
    if (!company?.id) return
    try {
      await markAllAsRead(company.id)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('Todas marcadas como lidas')
    } catch (err) {
      toast.error('Erro ao marcar todas como lidas')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success('Notificação removida')
    } catch (err) {
      toast.error('Erro ao remover notificação')
    }
  }

  const handleClearAll = async () => {
    if (!company?.id) return
    if (!window.confirm('Tem certeza que deseja limpar todo o histórico de notificações?')) return
    try {
      await clearAllNotifications(company.id)
      setNotifications([])
      toast.success('Histórico limpo')
    } catch (err) {
      toast.error('Erro ao limpar histórico')
    }
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read)

  const timeAgo = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Agora mesmo'
    if (minutes < 60) return `Há ${minutes} min`
    if (hours < 24) return `Há ${hours} h`
    if (days === 1) return 'Ontem'
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />
      case 'warning': return <AlertTriangle className="w-5 h-5" />
      case 'review': return <MessageSquare className="w-5 h-5" />
      case 'cancelled': return <X className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-500 bg-emerald-500/10'
      case 'warning': return 'text-amber-500 bg-amber-500/10'
      case 'review': return 'text-blue-500 bg-blue-500/10'
      case 'cancelled': return 'text-red-500 bg-red-500/10'
      default: return 'text-[#fbbf24] bg-[#fbbf24]/10'
    }
  }

  return (
    <div className="animate-fade-in pb-10 sm:pb-20 mt-4 sm:mt-8 space-y-4 sm:space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-8 px-2 sm:px-4 lg:px-0">
        <div className="space-y-2 sm:space-y-4">
          <span className="text-[8px] sm:text-xs tracking-[0.3em] uppercase font-label text-[#fbbf24] font-bold block">Central de Alertas</span>
          <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter text-[#E5E2E1] uppercase leading-none">Notificações</h1>
        </div>
        
        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
          <button 
            onClick={handleMarkAllRead}
            disabled={!notifications.some(n => !n.read)}
            className="flex-1 sm:flex-none text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#fbbf24] px-4 sm:px-6 py-2 sm:py-3 border border-[#fbbf24]/20 rounded-full hover:bg-[#fbbf24]/5 transition-all disabled:opacity-30"
          >
            Lidas
          </button>
          <button 
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="flex-1 sm:flex-none text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-red-500/60 px-4 sm:px-6 py-2 sm:py-3 border border-red-500/10 rounded-full hover:bg-red-500/5 transition-all disabled:opacity-30"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-0 grid grid-cols-12 gap-4 sm:gap-12">
        {/* Filters Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-4 sm:space-y-10">
          <div className="bg-[#1C1B1B] rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 border border-white/5 shadow-xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[#fbbf24]" />
              <h3 className="font-headline text-lg sm:text-xl font-black text-white uppercase tracking-tighter">Filtros</h3>
            </div>
            
            <div className="flex lg:flex-col gap-2 sm:gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {[
                { id: 'all', label: 'Todas', count: notifications.length },
                { id: 'unread', label: 'Não lidas', count: notifications.filter(n => !n.read).length }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setFilter(item.id as any)}
                  className={cn(
                    "flex-1 lg:w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    filter === item.id 
                      ? "bg-[#fbbf24] text-[#402D00]" 
                      : "bg-[#0e0e0e] text-zinc-500 hover:text-white"
                  )}
                >
                  <span>{item.label}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-lg text-[8px]",
                    filter === item.id ? "bg-[#402D00]/10" : "bg-white/5"
                  )}>{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-[#1C1B1B] rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-[#1C1B1B]/50 rounded-[3rem] p-20 text-center border border-dashed border-white/5">
              <div className="w-20 h-20 rounded-full bg-[#1C1B1B] flex items-center justify-center mx-auto mb-8 text-zinc-800">
                <Bell className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Sem notificações</h3>
              <p className="text-zinc-500 max-w-sm mx-auto">Tudo certo! Você não tem novas notificações no momento.</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-4">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "bg-[#1C1B1B] rounded-2xl sm:rounded-[2rem] p-0.5 transition-all border border-white/[0.02]",
                    !notification.read && "border-[#fbbf24]/10"
                  )}
                >
                  <div className="bg-[#1C1B1B] rounded-[1.2rem] sm:rounded-[1.9rem] p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* Icon */}
                    <div className={cn(
                      "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border border-white/5",
                      getColor(notification.type)
                    )}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-black text-sm sm:text-lg text-white tracking-tight uppercase truncate">{notification.title}</h4>
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 shrink-0">
                          {timeAgo(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-sm text-[#D3C5AC]/80 leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                        {notification.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkRead(notification.id)}
                          className="flex-1 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#fbbf24]/10 text-[#fbbf24] flex items-center justify-center hover:bg-[#fbbf24]/20 transition-all py-2 sm:py-0"
                        >
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(notification.id)}
                        className="flex-1 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 text-zinc-500 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all py-2 sm:py-0"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
