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
  X,
  Globe,
  Crown
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext'
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
  { path: ROUTES.SUBSCRIPTION, label: 'Assinatura', icon: Crown },
  { path: ROUTES.BILLING, label: 'Faturamento', icon: CreditCard },
  { path: ROUTES.PUBLIC_PAGE, label: 'Página Pública', icon: Globe },
  { path: ROUTES.SETTINGS, label: 'Configurações', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth()
  const { company } = useCompany()
  const location = useLocation()
  
  const isPro = company?.plan === 'pro'

  return (
    <aside 
      className={cn(
        "sidebar-container flex flex-col transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo & Close Button (Mobile) */}
      <div className="flex items-center justify-between px-6 h-[var(--topbar-h)] shrink-0 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <Sparkles className="w-4 h-4 text-primary-text" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight font-headline flex items-center gap-2">
            {APP_NAME}
            {isPro && (
              <span className="bg-primary/20 text-primary text-[8px] font-black px-1 py-0.5 rounded border border-primary-container/30 tracking-widest uppercase">
                PRO
              </span>
            )}
          </span>
        </div>
        
        <button 
          onClick={onClose}
          className="md:hidden p-2 -mr-2 text-text-muted hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1 no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 h-12 rounded-xl text-sm font-medium transition-all relative group',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-text-muted hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 transition-colors shrink-0',
                  isActive ? 'text-primary' : 'text-text-muted group-hover:text-white'
                )}
              />
              {item.label}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 shrink-0 border-t border-border-subtle">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 h-12 w-full rounded-xl text-sm font-medium text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  )
}
