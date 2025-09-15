'use client'

import { Navbar as FlowbiteNavbar, Button, Dropdown } from 'flowbite-react'
import { HiMenu, HiSun, HiMoon, HiLogout, HiUser, HiChevronDown } from 'react-icons/hi'
import { useUIStore } from '@/store/ui'
import { useAuthStore } from '@/store/auth'

export function Navbar() {
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <FlowbiteNavbar fluid className="bg-gradient-to-r from-jaguar-600 via-jaguar-500 to-coffee-600 border-b border-coffee-500 shadow-lg">
      <div className="flex items-center gap-4">
        <Button
          size="sm"
          onClick={toggleSidebar}
          className="lg:hidden bg-dark-900/20 hover:bg-dark-900/40 border-dark-900/30 text-dark-900"
        >
          <HiMenu className="h-5 w-5" />
        </Button>

        <FlowbiteNavbar.Brand>
          <div className="flex items-center gap-3">
            <img 
              src="/logo_negro_sin_nombre.png"
              alt="Jaguar Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-dark-900">
              JHC INVENTARIOS
            </span>
          </div>
        </FlowbiteNavbar.Brand>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="sm"
          onClick={toggleDarkMode}
          className="bg-dark-900/20 hover:bg-dark-900/40 border-dark-900/30 text-dark-900"
        >
          {darkMode ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
        </Button>

        {user && (
          <Dropdown
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
              <button className="flex items-center gap-2 bg-dark-900/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-dark-900/30 transition-colors duration-200">
                <HiUser className="h-4 w-4 text-dark-900" />
                <div className="text-left">
                  <div className="text-sm font-medium text-dark-900">
                    {user.nombre}
                  </div>
                  <div className="text-xs text-dark-800">
                    {user.rol}
                  </div>
                </div>
                <HiChevronDown className="h-4 w-4 text-dark-900" />
              </button>
            )}
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium">
                {user.nombre}
              </span>
              <span className="block truncate text-sm text-gray-500">
                {user.rol}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleLogout} className="text-red-600 hover:bg-red-50">
              <HiLogout className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Dropdown.Item>
          </Dropdown>
        )}
      </div>
    </FlowbiteNavbar>
  )
}