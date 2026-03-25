import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('sidebar-active')
    } else {
      document.body.classList.remove('sidebar-active')
    }
  }, [isMobileMenuOpen])

  return (
    <div className="min-h-screen bg-bg-base flex transition-layout">
      {/* Sidebar - Desktop and Mobile Drawer */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Mobile Sidebar overlay backdrop */}
      <div 
        className="sidebar-overlay"
        onClick={() => setIsMobileMenuOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 transition-layout lg:pl-[240px] md:pl-[200px]">
        {/* Navbar / Topbar */}
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden pt-[var(--topbar-h)] min-h-screen">
          <div className="layout-max-width py-6 md:py-8 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
