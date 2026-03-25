import { Bell, Menu, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getInitials } from '@/utils/helpers'
import { useLocation } from 'react-router-dom'
import { cn } from '@/utils/helpers'

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
  '/subscription': 'ASSINATURA',
}

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth()
  const location = useLocation()
  const userName = user?.user_metadata?.full_name || user?.email || 'Usuário'
  
  const pageTitle = routeTitles[location.pathname] || 'Dashboard'

  return (
    <header className="topbar-fixed transition-layout md:left-[200px] lg:left-[240px] left-0">
      <div className="flex items-center justify-between h-full w-full">
        
        {/* Left side: Mobile Hamburger + Title */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-text-muted hover:text-white rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <h2 className="text-xl md:text-2xl font-headline font-bold uppercase tracking-wider text-white !mb-0 hidden sm:block">
            {pageTitle}
          </h2>
        </div>

        {/* Right side: Actions & User Info */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <button className="relative p-2 rounded-lg text-text-muted hover:bg-white/5 hover:text-white transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </button>

          <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-border-subtle h-8">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white leading-none mb-1">{userName}</p>
              <p className="text-[10px] text-primary uppercase tracking-widest font-black leading-none">Admin</p>
            </div>
            
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-bg-surface border border-border-subtle group cursor-pointer hover:border-primary/50 transition-colors">
              <span className="text-xs font-bold text-primary">{getInitials(userName)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
