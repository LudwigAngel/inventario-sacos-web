'use client'


import { HiExclamation, HiCurrencyDollar, HiTruck } from 'react-icons/hi'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/DataTable'
import { AuthGuard } from '@/lib/auth-guard'
import { kpisAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { UserRole, type DeudaProveedor, type TableColumn } from '@/types'

export default function ConciliacionPage() {
  const { data: deudaProveedores, error, isLoading } = useSWR<DeudaProveedor[]>(
    '/deuda-proveedores',
    () => kpisAPI.getDeudaProveedores()
  )

  const columns: TableColumn<DeudaProveedor>[] = [
    {
      key: 'proveedor_nombre',
      label: 'Proveedor',
      sortable: true
    },
    {
      key: 'pedidos_pendientes',
      label: 'Pedidos Pendientes',
      sortable: true,
      render: (deuda) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
          {deuda.pedidos_pendientes}
        </span>
      )
    },
    {
      key: 'total_deuda',
      label: 'Deuda Total',
      sortable: true,
      render: (deuda) => (
        <span className={`font-medium ${deuda.total_deuda > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
          {formatCurrency(deuda.total_deuda)}
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (deuda) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deuda.total_deuda > 10000 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
          deuda.total_deuda > 5000 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          }`}>
          {deuda.total_deuda > 10000 ? 'CRÍTICO' :
            deuda.total_deuda > 5000 ? 'ALTO' : 'NORMAL'}
        </span>
      )
    }
  ]

  const totalDeuda = deudaProveedores?.reduce((sum, deuda) => sum + deuda.total_deuda, 0) || 0
  const proveedoresConDeuda = deudaProveedores?.filter(d => d.total_deuda > 0).length || 0
  const pedidosPendientesTotales = deudaProveedores?.reduce((sum, deuda) => sum + deuda.pedidos_pendientes, 0) || 0

  if (error) {
    return (
      <AuthGuard requiredRoles={[UserRole.ADMIN, UserRole.PAGOS]}>
        <DashboardLayout>
          <div className="text-center py-12">
            <p className="text-red-500">Error al cargar los datos de conciliación</p>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRoles={[UserRole.ADMIN, UserRole.PAGOS]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="jaguar-header">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src="/logo_dorado_sin_nombre.png"
                alt="Jaguar Logo"
                className="h-8 w-8"
              />
              <div className="text-2xl">⚖️</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                Conciliación de Deudas
              </h1>
            </div>
            <p className="jaguar-header-subtitle">
               Vista consolidada de deudas por proveedor y estado de pagos
            </p>
          </div>

          {/* KPIs de Conciliación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 rounded-xl p-4 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-md">
                    <HiExclamation className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-xs font-medium text-red-700 dark:text-red-300 truncate">
                    Deuda Total
                  </p>
                  <p className="text-lg font-bold text-red-900 dark:text-red-200 truncate">
                    {isLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      formatCurrency(totalDeuda)
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 shadow-md">
                    <HiCurrencyDollar className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300 truncate">
                    Proveedores con Deuda
                  </p>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-200 truncate">
                    {isLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      proveedoresConDeuda
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 shadow-md">
                    <HiTruck className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300 truncate">
                    Pedidos Pendientes
                  </p>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-200 truncate">
                    {isLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      pedidosPendientesTotales
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Deudas por Proveedor */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-3 flex items-center">
              <span className="text-xl mr-2">📊</span>
              Deuda por Proveedor
            </h2>

            <DataTable
              data={deudaProveedores || []}
              columns={columns}
              searchPlaceholder="Buscar proveedores..."
              emptyMessage="No hay datos de deuda disponibles"
            />
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <div className="bg-white dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl p-4 shadow-lg">
              <h3 className="text-base font-semibold text-amber-900 dark:text-amber-200 mb-3">
                Resumen de Estados
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-amber-700 dark:text-amber-300 text-sm">Crítico (&gt;S/ 10,000)</span>
                  </div>
                  <span className="font-medium text-amber-900 dark:text-amber-200">
                    {(deudaProveedores?.filter(d => d.total_deuda > 10000) || []).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-amber-700 dark:text-amber-300 text-sm">Alto (S/ 5,000 - S/ 10,000)</span>
                  </div>
                  <span className="font-medium text-amber-900 dark:text-amber-200">
                    {(deudaProveedores?.filter(d => d.total_deuda > 5000 && d.total_deuda <= 10000) || []).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-amber-700 dark:text-amber-300 text-sm">Normal (≤S/ 5,000)</span>
                  </div>
                  <span className="font-medium text-amber-900 dark:text-amber-200">
                    {(deudaProveedores?.filter(d => d.total_deuda <= 5000) || []).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl p-4 shadow-lg">
              <h3 className="text-base font-semibold text-amber-900 dark:text-amber-200 mb-3">
                Acciones Recomendadas
              </h3>
              <div className="space-y-2">
                {(deudaProveedores?.filter(d => d.total_deuda > 10000) || []).length > 0 && (
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-xs text-red-800 dark:text-red-200">
                      <strong>Urgente:</strong> Revisar proveedores con deuda crítica
                    </p>
                  </div>
                )}
                {(deudaProveedores?.filter(d => d.total_deuda > 5000 && d.total_deuda <= 10000) || []).length > 0 && (
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      <strong>Atención:</strong> Monitorear proveedores con deuda alta
                    </p>
                  </div>
                )}
                {pedidosPendientesTotales > 0 && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <strong>Seguimiento:</strong> {pedidosPendientesTotales} pedidos pendientes de recepción
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}