import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Scissors,
  Users,
  CalendarCheck,
  Users2,
  Clock,
  CalendarOff,
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, APP_NAME } from '@/utils/constants'
import { cn } from '@/utils/helpers'

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.SERVICES, label: 'Serviços', icon: Scissors },
  { path: ROUTES.CLIENTS, label: 'Clientes', icon: Users },
  { path: ROUTES.APPOINTMENTS, label: 'Agendamentos', icon: CalendarCheck },
  { path: ROUTES.STAFF, label: 'Equipe', icon: Users2 },
  { path: ROUTES.BUSINESS_HOURS, label: 'Horários', icon: Clock },
  { path: ROUTES.BLOCKED_TIMES, label: 'Bloqueios', icon: CalendarOff },
  { path: ROUTES.BILLING, label: 'Faturamento', icon: CreditCard },
  { path: ROUTES.SETTINGS, label: 'Configurações', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-[240px] flex flex-col transition-transform duration-300 md:translate-x-0 bg-surface-container-lowest",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo & Close Button (Mobile) */}
      <div className="flex items-center justify-between px-[24px] h-[80px] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-container shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <Sparkles className="w-5 h-5 text-on-primary-fixed" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight font-headline">{APP_NAME}</span>
        </div>
        
        <button 
          onClick={onClose}
          className="md:hidden p-2 -mr-2 text-on-surface-variant hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[12px] py-[16px] overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) onClose()
              }}
              className={cn(
                'flex items-center gap-3 px-[16px] h-[48px] rounded-xl text-sm font-medium transition-all relative overflow-hidden group',
                isActive 
                  ? 'text-primary-container bg-primary-container/10' 
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 transition-colors shrink-0',
                  isActive ? 'text-primary-container' : 'text-on-surface-variant group-hover:text-white'
                )}
              />
              {item.label}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-container rounded-r-full" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-[16px] shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-[16px] h-[48px] w-full rounded-xl text-sm font-medium text-on-surface-variant hover:text-danger-500 hover:bg-danger-500/5 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  )
}
