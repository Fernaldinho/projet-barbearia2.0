import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Scissors,
  Users,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Plus,
  X,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, APP_NAME } from '@/utils/constants'
import { cn } from '@/utils/helpers'

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'DASHBOARD', icon: LayoutDashboard },
  { path: ROUTES.APPOINTMENTS, label: 'SCHEDULE', icon: CalendarDays },
  { path: ROUTES.CLIENTS, label: 'CLIENTS', icon: Users },
  { path: ROUTES.SERVICES, label: 'SERVICES', icon: Scissors },
  { path: ROUTES.STAFF, label: 'ANALYTICS', icon: BarChart3 }, // Using Staff route as placeholder for now or Analytics if available
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
        "fixed left-0 top-0 z-40 h-screen w-[280px] flex flex-col transition-transform duration-300 md:translate-x-0 bg-[#0e0e0e] border-r border-white/5",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Label */}
      <div className="flex items-center justify-between px-8 h-[100px] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-primary-container tracking-tighter uppercase font-headline">AgendaAI</span>
        </div>
        
        <button 
          onClick={onClose}
          className="md:hidden p-2 -mr-2 text-on-surface-variant hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 overflow-y-auto space-y-2">
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
                'flex items-center gap-4 px-6 h-14 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all relative group',
                isActive 
                  ? 'text-primary-container bg-primary-container/10' 
                  : 'text-on-surface-variant/40 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'w-4 h-4 transition-colors shrink-0 outline-none',
                  isActive ? 'text-primary-container' : 'text-on-surface-variant/30 group-hover:text-white'
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

      {/* Action Area & Footer */}
      <div className="p-8 space-y-8 shrink-0">
        <button className="w-full bg-primary-container text-on-primary-fixed h-14 rounded-full flex items-center justify-center gap-3 font-black text-[10px] tracking-widest uppercase shadow-lg shadow-primary-container/5 hover:scale-[1.02] active:scale-95 transition-all">
          <Plus className="w-4 h-4" />
          New Appointment
        </button>

        <div className="space-y-4">
          <button className="flex items-center gap-4 px-6 text-[10px] font-black text-on-surface-variant/40 hover:text-white transition-all uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" />
            Support
          </button>
          
          <button
            onClick={logout}
            className="flex items-center gap-4 px-6 text-[10px] font-black text-on-surface-variant/40 hover:text-danger-500 transition-all uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}

