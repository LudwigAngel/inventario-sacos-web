'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  HiHome,
  HiShoppingCart,
  HiArchive,
  HiTag,
  HiClipboardList,
  HiDocumentText,
  HiCreditCard,
  HiScale,
  HiTruck,
  HiPlus,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { UserRole } from '@/types'
import { RoleGate } from '@/lib/auth-guard'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: HiHome,
    roles: [UserRole.ADMIN, UserRole.COMPRAS, UserRole.ALMACEN, UserRole.VENDEDOR, UserRole.PAGOS, UserRole.DESPACHO]
  },
  {
    label: 'Pedidos',
    href: '/compras/pedidos',
    icon: HiShoppingCart,
    roles: [UserRole.ADMIN, UserRole.COMPRAS]
  },
  {
    label: 'Recepción',
    href: '/almacen/recepcion',
    icon: HiArchive,
    roles: [UserRole.ADMIN, UserRole.ALMACEN]
  },
  {
    label: 'Etiquetado',
    href: '/almacen/etiquetado',
    icon: HiTag,
    roles: [UserRole.ADMIN, UserRole.ALMACEN]
  },
  {
    label: 'Listas',
    href: '/listas',
    icon: HiClipboardList,
    roles: [UserRole.ADMIN, UserRole.VENDEDOR]
  },
  {
    label: 'Proformas',
    href: '/ventas/proformas',
    icon: HiDocumentText,
    roles: [UserRole.ADMIN, UserRole.VENDEDOR]
  },
  {
    label: 'Crear Proforma',
    href: '/ventas/crear-proforma',
    icon: HiPlus,
    roles: [UserRole.ADMIN, UserRole.VENDEDOR]
  },
  {
    label: 'Pagos',
    href: '/pagos',
    icon: HiCreditCard,
    roles: [UserRole.ADMIN, UserRole.PAGOS]
  },
  {
    label: 'Conciliación',
    href: '/conciliacion',
    icon: HiScale,
    roles: [UserRole.ADMIN, UserRole.PAGOS]
  },
  {
    label: 'Despacho',
    href: '/despacho',
    icon: HiTruck,
    roles: [UserRole.ADMIN, UserRole.DESPACHO]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()

  return (
    <div className={`h-screen bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 border-r border-amber-300 shadow-xl transition-all duration-300 ease-in-out flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
      {/* Logo/Brand Section */}
      <div className="px-4 py-6 border-b border-amber-300 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg relative flex-shrink-0">
        {/* Botón minimizar/expandir */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-amber-900 rounded-full p-1.5 shadow-lg transition-all duration-200 z-10 hover:scale-110"
          title={sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {sidebarCollapsed ? (
            <HiChevronRight className="h-4 w-4" />
          ) : (
            <HiChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div className="flex items-center space-x-3">
          <img
            src="/logo_negro_sin_nombre.png"
            alt="Jaguar Logo"
            className="h-10 w-10 flex-shrink-0"
          />
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-amber-900 leading-tight truncate">
                JHC INVENTARIOS
              </h1>
              <p className="text-xs text-amber-800 opacity-90 truncate">
                Sistema de Gestión
              </p>
            </div>
          )}
        </div>

        {user && !sidebarCollapsed && (
          <div className="mt-3 p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <p className="text-xs font-medium text-amber-900 truncate">
              👤 {user.nombre}
            </p>
            <p className="text-xs text-amber-800 opacity-80 truncate">
              {user.rol}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <RoleGate key={item.href} requiredRoles={item.roles}>
              <Link
                href={item.href}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
                  ${pathname === item.href
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 shadow-md'
                    : 'text-amber-800 hover:bg-amber-200/60 hover:text-amber-900 hover:shadow-sm'
                  }
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon
                  className={`
                    h-5 w-5 transition-colors duration-200 flex-shrink-0
                    ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}
                    ${pathname === item.href
                      ? 'text-amber-900'
                      : 'text-amber-700 group-hover:text-amber-900'
                    }
                  `}
                />
                {!sidebarCollapsed && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {pathname === item.href && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-amber-900 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </>
                )}
              </Link>
            </RoleGate>
          ))}
        </nav>
      </div>

      {/* Footer con información del sistema */}
      {!sidebarCollapsed && (
        <div className="border-t border-amber-300 p-3 bg-gradient-to-r from-amber-100 to-amber-200 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-amber-700 font-medium">
              JHC INVENTARIOS v1.0
            </p>
            <p className="text-xs text-amber-600 opacity-80">
              Sistema de Gestión
            </p>
          </div>
        </div>
      )}
    </div>
  )
}