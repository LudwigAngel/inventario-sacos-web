'use client'


import { Card } from 'flowbite-react'
import { HiArchive, HiClock, HiCurrencyDollar, HiExclamation } from 'react-icons/hi'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { kpisAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { KPIData } from '@/types'

const fetcher = () => kpisAPI.getDashboard()

export default function DashboardPage() {
  const { data: kpis, error, isLoading } = useSWR<KPIData>('/kpis/dashboard', fetcher, {
    refreshInterval: 30000 // Actualizar cada 30 segundos
  })

  const kpiCards = [
    {
      title: 'Stock Disponible',
      value: kpis?.stock_disponible || 0,
      icon: HiArchive,
      color: 'from-jaguar-500 to-jaguar-600',
      suffix: ' conjuntos'
    },
    {
      title: 'Reservas por Vencer',
      value: kpis?.reservas_por_vencer || 0,
      icon: HiClock,
      color: 'from-coffee-500 to-coffee-600',
      suffix: ' reservas'
    },
    {
      title: 'Ventas del Día',
      value: kpis?.ventas_del_dia || 0,
      icon: HiCurrencyDollar,
      color: 'from-jaguar-600 to-coffee-500',
      formatter: formatCurrency
    },
    {
      title: 'Deuda Proveedor',
      value: kpis?.deuda_proveedor || 0,
      icon: HiExclamation,
      color: 'from-coffee-600 to-coffee-700',
      formatter: formatCurrency
    }
  ]

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Error al cargar los datos del dashboard</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col space-y-6">
        <div className="flex-shrink-0 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
            <img 
              src="/logo_dorado_sin_nombre.png" 
              alt="Jaguar Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-2xl lg:text-3xl font-bold text-coffee-800 dark:text-jaguar-200">
              Dashboard
            </h1>
          </div>
          <p className="text-base text-coffee-600 dark:text-coffee-300">
            Resumen general del sistema de inventario
          </p>
          <div className="mt-3 bg-jaguar-100 dark:bg-coffee-800/30 rounded-full px-4 py-2 inline-block">
            <span className="text-coffee-800 dark:text-jaguar-300 font-medium flex items-center gap-2 text-sm">
              <img 
                src="/logo_dorado_sin_nombre.png" 
                alt="Jaguar Logo" 
                className="h-4 w-4"
              />
              Sistema Inventarios - Panel de Control
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="relative overflow-hidden bg-white dark:bg-dark-800 border border-jaguar-200 dark:border-coffee-600 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center p-4">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color} shadow-lg`}>
                    <kpi.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-xs font-medium text-coffee-600 dark:text-jaguar-400 mb-1 truncate">
                    {kpi.title}
                  </p>
                  <p className="text-xl font-bold text-coffee-800 dark:text-jaguar-200 truncate">
                    {isLoading ? (
                      <span className="animate-pulse text-jaguar-400">...</span>
                    ) : (
                      <>
                        {kpi.formatter ? kpi.formatter(kpi.value) : kpi.value}
                        {kpi.suffix}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-jaguar-400 to-coffee-500"></div>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-dark-800 border border-jaguar-200 dark:border-coffee-600 shadow-lg">
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-base font-semibold text-coffee-800 dark:text-jaguar-200 mb-3 flex items-center flex-shrink-0">
                <span className="text-xl mr-2">🚀</span>
                Accesos Rápidos
              </h3>
              <div className="space-y-2 flex-1 overflow-y-auto">
                <a
                  href="/almacen/recepcion"
                  className="block p-3 rounded-lg bg-jaguar-50 dark:bg-coffee-800/30 hover:bg-jaguar-100 dark:hover:bg-coffee-700/50 transition-all duration-200 border border-jaguar-200 dark:border-coffee-600 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📦</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-coffee-800 dark:text-jaguar-200 text-sm truncate">
                        Recepción de Conjuntos
                      </div>
                      <div className="text-xs text-coffee-600 dark:text-coffee-300 truncate">
                        Registrar nuevos conjuntos recibidos
                      </div>
                    </div>
                  </div>
                </a>
                <a
                  href="/ventas/crear-proforma"
                  className="block p-3 rounded-lg bg-jaguar-50 dark:bg-coffee-800/30 hover:bg-jaguar-100 dark:hover:bg-coffee-700/50 transition-all duration-200 border border-jaguar-200 dark:border-coffee-600 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📋</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-coffee-800 dark:text-jaguar-200 text-sm truncate">
                        Crear Proforma Manual
                      </div>
                      <div className="text-xs text-coffee-600 dark:text-coffee-300 truncate">
                        Generar proforma con descuentos
                      </div>
                    </div>
                  </div>
                </a>
                <a
                  href="/listas"
                  className="block p-3 rounded-lg bg-jaguar-50 dark:bg-coffee-800/30 hover:bg-jaguar-100 dark:hover:bg-coffee-700/50 transition-all duration-200 border border-jaguar-200 dark:border-coffee-600 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📝</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-coffee-800 dark:text-jaguar-200 text-sm truncate">
                        Gestionar Listas
                      </div>
                      <div className="text-xs text-coffee-600 dark:text-coffee-300 truncate">
                        Administrar catálogos públicos
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-dark-800 border border-jaguar-200 dark:border-coffee-600 shadow-lg">
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-base font-semibold text-coffee-800 dark:text-jaguar-200 mb-3 flex items-center flex-shrink-0">
                <span className="text-xl mr-2">⚡</span>
                Estado del Sistema
              </h3>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between p-2 bg-jaguar-50 dark:bg-coffee-800/30 rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="text-base mr-2">🕒</span>
                    <span className="text-coffee-700 dark:text-jaguar-300 text-sm truncate">
                      Última actualización
                    </span>
                  </div>
                  <span className="text-xs font-medium text-coffee-800 dark:text-jaguar-200 flex-shrink-0">
                    {new Date().toLocaleTimeString('es-PE')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-jaguar-50 dark:bg-coffee-800/30 rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="text-base mr-2">🖥️</span>
                    <span className="text-coffee-700 dark:text-jaguar-300 text-sm truncate">
                      Estado del servidor
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-jaguar-400 text-dark-900 flex-shrink-0">
                    ✅ Activo
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-jaguar-50 dark:bg-coffee-800/30 rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="text-base mr-2">🔗</span>
                    <span className="text-coffee-700 dark:text-jaguar-300 text-sm truncate">
                      Conexión API
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-jaguar-400 text-dark-900 flex-shrink-0">
                    ✅ Conectado
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}