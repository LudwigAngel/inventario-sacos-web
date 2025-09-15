'use client'


import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useUIStore } from '@/store/ui'
import { AuthGuard } from '@/lib/auth-guard'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen, sidebarCollapsed } = useUIStore()

  return (
    <AuthGuard>
      <div className="flex h-screen w-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-dark-950 dark:via-dark-900 dark:to-coffee-950 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out 
          lg:translate-x-0 lg:static lg:inset-0 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
          <Sidebar />
        </div>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-dark-900/75 backdrop-blur-sm lg:hidden"
            onClick={() => useUIStore.getState().setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-amber-50/50 via-transparent to-yellow-50/50 dark:from-dark-900/50 dark:via-transparent dark:to-coffee-900/50">
            <div className="px-4 py-4 min-h-full">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}