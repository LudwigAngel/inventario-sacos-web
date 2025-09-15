'use client'

import { useState } from 'react'
import { Button, Card, Label, TextInput, Badge } from 'flowbite-react'
import { HiTruck, HiCalendar, HiClipboardList } from 'react-icons/hi'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/DataTable'
import { StatusPill } from '@/components/ui/StatusPill'
import { PdfButton, PngButton } from '@/components/ui/ExportButtons'
import { AuthGuard } from '@/lib/auth-guard'
import { proformasAPI } from '@/lib/api'
import { formatDate, formatCurrency } from '@/lib/utils'
import { UserRole, type Proforma, type TableColumn, ProformaEstado } from '@/types'

export default function DespachoPage() {
  const [fechaDespacho, setFechaDespacho] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [proformasSeleccionadas, setProformasSeleccionadas] = useState<number[]>([])

  const { data: proformasPagadas } = useSWR('/proformas-pagadas', () => 
    proformasAPI.getAll().then(res => ({
      ...res,
      items: res.items.filter(p => p.estado === ProformaEstado.PAGADA)
    }))
  )

  const columns: TableColumn<Proforma>[] = [
    {
      key: 'select',
      label: 'Seleccionar',
      render: (proforma) => (
        <input
          type="checkbox"
          checked={proformasSeleccionadas.includes(proforma.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setProformasSeleccionadas(prev => [...prev, proforma.id])
            } else {
              setProformasSeleccionadas(prev => prev.filter(id => id !== proforma.id))
            }
          }}
          className="w-4 h-4 text-amber-600 bg-amber-50 border-amber-300 rounded focus:ring-amber-500"
        />
      )
    },
    {
      key: 'id',
      label: 'Proforma',
      sortable: true,
      render: (proforma) => `#${proforma.id}`
    },
    {
      key: 'cliente_nombre',
      label: 'Cliente',
      sortable: true
    },
    {
      key: 'cliente_telefono',
      label: 'Teléfono',
      render: (proforma) => proforma.cliente_telefono || 'N/A'
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (proforma) => formatCurrency(proforma.total)
    },
    {
      key: 'lineas',
      label: 'Productos',
      render: (proforma) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          {proforma.lineas?.length || 0} items
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Fecha Venta',
      sortable: true,
      render: (proforma) => formatDate(proforma.created_at)
    }
  ]

  const proformasParaDespacho = proformasPagadas?.items.filter(p => 
    proformasSeleccionadas.includes(p.id)
  ) || []

  const totalProformas = proformasParaDespacho.length
  const totalItems = proformasParaDespacho.reduce((sum, p) => sum + (p.lineas?.length || 0), 0)
  const totalMonto = proformasParaDespacho.reduce((sum, p) => sum + p.total, 0)

  const handleSelectAll = () => {
    if (proformasSeleccionadas.length === proformasPagadas?.items.length) {
      setProformasSeleccionadas([])
    } else {
      setProformasSeleccionadas(proformasPagadas?.items.map(p => p.id) || [])
    }
  }

  const generarHojaDespacho = () => {
    if (proformasSeleccionadas.length === 0) {
      alert('Selecciona al menos una proforma para despachar')
      return
    }
    
    // Aquí se podría llamar a una API para marcar como despachadas
    console.log('Generando hoja de despacho para:', proformasSeleccionadas)
  }

  return (
    <AuthGuard requiredRoles={[UserRole.ADMIN, UserRole.DESPACHO]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="jaguar-header">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <img 
                    src="/logo_dorado_sin_nombre.png" 
                    alt="Jaguar Logo" 
                    className="h-10 w-10"
                  />
                  <div className="text-3xl">🚚</div>
                  <h1 className="jaguar-header-title">
                    Gestión de Despachos
                  </h1>
                </div>
                <p className="jaguar-header-subtitle">
                   Agrupa y despacha proformas pagadas por fecha
                </p>
              </div>
              <div className="flex gap-3">
                {proformasSeleccionadas.length > 0 && (
                  <>
                    <PdfButton 
                      elementId="hoja-despacho" 
                      filename={`despacho-${fechaDespacho}`}
                    />
                    <PngButton 
                      elementId="hoja-despacho" 
                      filename={`despacho-${fechaDespacho}`}
                    />
                  </>
                )}
                <button
                  onClick={generarHojaDespacho}
                  disabled={proformasSeleccionadas.length === 0}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2 ${
                    proformasSeleccionadas.length === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 hover:from-amber-500 hover:to-yellow-600'
                  }`}
                >
                  <HiTruck className="h-5 w-5" />
                  <span>Generar Despacho</span>
                </button>
              </div>
            </div>
          </div>

          {/* Controles de fecha y selección */}
          <div className="jaguar-header">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <label htmlFor="fecha_despacho" className="block text-sm font-medium jaguar-header-subtitle mb-1">
                    📅 Fecha de Despacho
                  </label>
                  <input
                    id="fecha_despacho"
                    type="date"
                    value={fechaDespacho}
                    onChange={(e) => setFechaDespacho(e.target.value)}
                    className="px-3 py-2 jaguar-search-input rounded-lg border focus:ring-2 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-white dark:bg-amber-900/20 border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors duration-200 font-medium shadow-sm"
                >
                  {proformasSeleccionadas.length === proformasPagadas?.items.length ? 
                    'Deseleccionar Todo' : 'Seleccionar Todo'}
                </button>
              </div>

              {proformasSeleccionadas.length > 0 && (
                <div className="text-sm jaguar-header-subtitle font-medium">
                  ✅ {proformasSeleccionadas.length} proforma(s) seleccionada(s)
                </div>
              )}
            </div>
          </div>

          {/* Resumen de selección */}
          {proformasSeleccionadas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 shadow-md">
                      <HiClipboardList className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-amber-700">
                      Proformas
                    </p>
                    <p className="text-2xl font-bold text-amber-900">
                      {totalProformas}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-md">
                      <HiTruck className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-700">
                      Total Items
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {totalItems}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 shadow-md">
                      <HiCalendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-amber-700">
                      Valor Total
                    </p>
                    <p className="text-2xl font-bold text-amber-900">
                      {formatCurrency(totalMonto)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabla de proformas */}
          <DataTable
            data={proformasPagadas?.items || []}
            columns={columns}
            searchPlaceholder="Buscar proformas..."
            emptyMessage="No hay proformas pagadas disponibles para despacho"
          />

          {/* Hoja de despacho (contenido exportable) */}
          {proformasSeleccionadas.length > 0 && (
            <div id="hoja-despacho" className="bg-white p-8 rounded-lg" style={{ display: 'none' }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">HOJA DE DESPACHO</h1>
                <p className="text-gray-600 mt-2">Fecha: {formatDate(fechaDespacho)}</p>
              </div>

              {/* Resumen */}
              <div className="grid grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Proformas</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProformas}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonto)}</p>
                </div>
              </div>

              {/* Detalle de proformas */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Detalle de Proformas a Despachar
                </h2>
                
                {proformasParaDespacho.map((proforma, index) => (
                  <div key={proforma.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Proforma #{proforma.id}
                        </h3>
                        <p className="text-gray-600">Cliente: {proforma.cliente_nombre}</p>
                        {proforma.cliente_telefono && (
                          <p className="text-gray-600">Teléfono: {proforma.cliente_telefono}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(proforma.total)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {proforma.lineas?.length || 0} items
                        </p>
                      </div>
                    </div>

                    {/* Items de la proforma */}
                    {proforma.lineas && proforma.lineas.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {proforma.lineas.map((linea, lineaIndex) => (
                            <div key={lineaIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">
                                {linea.saco?.tipo} - {linea.saco?.temporada} (ID: {linea.saco?.id})
                              </span>
                              <span className="text-sm font-medium">
                                {formatCurrency(linea.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Firmas */}
              <div className="mt-12 grid grid-cols-2 gap-12">
                <div className="text-center">
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-sm text-gray-600">Preparado por</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-sm text-gray-600">Recibido por</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}