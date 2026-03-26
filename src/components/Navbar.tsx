import { Bell, Menu, X, CheckCircle, Info, AlertTriangle, MessageSquare } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getInitials, cn } from '@/utils/helpers'
import { useLocation, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useCompany } from '@/contexts/CompanyContext'

const routeTitles: Record<string, string> = {
  '/dashboard': 'DASHBOARD',
  '/services': 'SERVIÇOS',
  '/clients': 'CLIENTES',
  '/appointments': 'AGENDAMENTOS',
  '/staff': 'EQUIPE',
  '/business-hours': 'HORÁRIOS',
  '/blocked-times': 'BLOQUEIOS',
  '/billing': 'FATURAMENTO',
  '/settings': 'CONFIGURAÇÕES',
  '/public-page': 'PÁGINA PÚBLICA',
  '/notifications': 'NOTIFICAÇÕES',
}

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth()
  const { company } = useCompany()
  const location = useLocation()
  
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!company?.id) return
    loadNotifications()
    
    // Subscribe to new notifications
    const sub = supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `company_id=eq.${company.id}`
      }, () => {
        loadNotifications()
        // Sound or pulse could be added here
      })
      .subscribe()
      
    return () => { sub.unsubscribe() }
  }, [company?.id])

  const loadNotifications = async () => {
    if (!company?.id) return
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) {
      setNotifications(data)
    }
    
    // Fetch total unread count across all notifications
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', company.id)
      .eq('read', false)
      
    setUnreadCount(count || 0)
  }

  const markAllRead = async () => {
    if (!company?.id) return
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('company_id', company.id)
      .eq('read', false)
    
    loadNotifications()
  }
  
  const markSingleRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    
    loadNotifications()
    setShowNotifications(false)
  }

  const userName = user?.user_metadata?.full_name || user?.email || 'Usuário'
  const pageTitle = routeTitles[location.pathname] || 'Dashboard'

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'agora'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    return new Date(date).toLocaleDateString()
  }

  return (
    <header style={{ backgroundColor: '#121212', borderBottom: '1px solid #262626' }} className="fixed top-0 right-0 z-30 h-[56px] md:h-[64px] backdrop-blur-lg left-0 md:left-[240px] transition-all">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        
        {/* Left side: Mobile Hamburger + Title */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-dark-400 hover:text-white rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h2 className="!mb-0 whitespace-nowrap" style={{ fontFamily: "'Bebas Neue', 'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '22px', fontWeight: 400, color: '#f2f2f2' }}>{pageTitle}</h2>
        </div>

        {/* Right side: Actions & User Info */}
        <div className="flex items-center gap-[16px] shrink-0">
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications)
              }}
              className={cn(
                "relative p-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-white transition-all",
                showNotifications && "bg-dark-800 text-white"
              )}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-[#121212]" style={{ backgroundColor: '#e7b008' }} />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-[#1A1A1A] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in animate-scale-in">
                  <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#1f1f1f]">
                    <div className="flex flex-col">
                      <h3 className="text-xs font-black tracking-widest uppercase text-white mb-0">Notificações</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); markAllRead() }}
                          className="text-[9px] font-black uppercase text-[#fbbf24] hover:underline mt-1 text-left"
                        >
                          Marcar todas como lidas
                        </button>
                      )}
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="text-dark-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center space-y-3">
                        <Bell className="w-8 h-8 text-[#262626] mx-auto" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-dark-500">Nenhuma notificação</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#262626]">
                        {notifications.map((n) => (
                          <div key={n.id} className={cn("p-4 flex gap-4 hover:bg-white/[0.02] transition-colors", !n.read && "bg-[#fbbf24]/5")}>
                            <div className={cn(
                              "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
                              n.type === 'success' ? "bg-emerald-500/10 text-emerald-500" :
                              n.type === 'warning' ? "bg-amber-500/10 text-amber-500" :
                              "bg-[#fbbf24]/10 text-[#fbbf24]"
                            )}>
                              {n.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                               n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                               n.type === 'review' ? <MessageSquare className="w-4 h-4" /> :
                               <Bell className="w-4 h-4" />
                              }
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-xs font-bold text-white leading-tight">{n.title}</p>
                              <p className="text-[11px] text-dark-400 leading-snug">{n.message}</p>
                              <p className="text-[9px] text-dark-500 uppercase font-black">{timeAgo(n.created_at)}</p>
                            </div>
                            {!n.read && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); markSingleRead(n.id) }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20 transition-all ml-auto self-center"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-[#131313] border-t border-[#262626] text-center flex flex-col gap-2">
                    <Link 
                      to="/notifications" 
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] hover:underline"
                    >
                      Ver todas as notificações
                    </Link>
                    <p className="text-[9px] font-black uppercase tracking-widest text-dark-500">AgendaAI Pro System</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-[8px] pl-[16px] border-l border-dark-800">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-small font-medium text-white mb-0.5">{userName}</p>
              <p className="text-[10px] text-dark-400 leading-none">Admin</p>
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
              <span className="text-xs font-semibold" style={{ color: '#e7b008' }}>{getInitials(userName)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
