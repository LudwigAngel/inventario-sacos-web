'use client'

import { useState } from 'react'
import { Button, Modal, Label, TextInput, Select, Badge } from 'flowbite-react'
import { HiPlus, HiEye, HiClock, HiCheck } from 'react-icons/hi'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/DataTable'
import { StatusPill } from '@/components/ui/StatusPill'
import { PdfButton, PngButton } from '@/components/ui/ExportButtons'
import { AuthGuard } from '@/lib/auth-guard'
import { proformasAPI } from '@/lib/api'
import { formatDate, formatCurrency, formatDateTime, isExpired, isExpiringSoon } from '@/lib/utils'
import { UserRole, type Proforma, type TableColumn, ProformaEstado } from '@/types'
import { toast } from 'react-hot-toast'

export default function ProformasPage() {
  const [selectedProforma, setSelectedProforma] = useState<Proforma | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const { data: proformas, mutate } = useSWR('/proformas', () => proformasAPI.getAll())

  const columns: TableColumn<Proforma>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
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
      key: 'estado',
      label: 'Estado',
      render: (proforma) => <StatusPill status={proforma.estado} />
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (proforma) => formatCurrency(proforma.total)
    },
    {
      key: 'fecha_expiracion',
      label: 'Expiración',
      render: (proforma) => {
        if (!proforma.fecha_expiracion) return 'N/A'
        
        const expired = isExpired(proforma.fecha_expiracion)
        const expiringSoon = isExpiringSoon(proforma.fecha_expiracion)
        
        return (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              expired ? 'text-red-600' : 
              expiringSoon ? 'text-yellow-600' : 
              'text-gray-600'
            }`}>
              {formatDateTime(proforma.fecha_expiracion)}
            </span>
            {expired && <HiClock className="h-4 w-4 text-red-500" />}
            {expiringSoon && !expired && <HiClock className="h-4 w-4 text-yellow-500" />}
          </div>
        )
      }
    },
    {
      key: 'created_at',
      label: 'Fecha Creación',
      sortable: true,
      render: (proforma) => formatDate(proforma.created_at)
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (proforma) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            color="info"
            onClick={() => {
              setSelectedProforma(proforma)
              setShowDetailModal(true)
            }}
          >
            <HiEye className="h-4 w-4" />
          </Button>
          {proforma.estado === ProformaEstado.EMITIDA && (
            <Button
              size="xs"
              color="success"
              onClick={() => handleEmitir(proforma.id)}
            >
              <HiCheck className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  const handleEmitir = async (proformaId: number) => {
    try {
      await proformasAPI.emitir(proformaId)
      toast.success('Proforma emitida como reserva')
      mutate()
    } catch (error) {
      toast.error('Error al emitir proforma')
    }
  }

  return (
    <AuthGuard requiredRoles={[UserRole.ADMIN, UserRole.VENDEDOR]}>
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
                  <div className="text-3xl">📄</div>
                  <h1 className="jaguar-header-title">
                    Gestión de Proformas
                  </h1>
                </div>
                <p className="jaguar-header-subtitle">
                   Administra las proformas de venta y su estado
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = '/ventas/crear-proforma'}
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
                >
                  <HiPlus className="h-5 w-5" />
                  <span>Crear Proforma Manual</span>
                </button>
                <button
                  onClick={() => window.open('/listas', '_blank')}
                  className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors duration-200 font-medium shadow-sm"
                >
                  Gestionar Listas Públicas
                </button>
              </div>
            </div>
          </div>

          <DataTable
            data={proformas?.items || []}
            columns={columns}
            searchPlaceholder="Buscar proformas..."
            filters={[
              {
                key: 'estado',
                label: 'Estado',
                options: Object.values(ProformaEstado).map(estado => ({
                  value: estado,
                  label: estado
                }))
              }
            ]}
          />
        </div>

        {/* Modal Detalle Proforma */}
        <Modal show={showDetailModal} onClose={() => setShowDetailModal(false)} size="4xl">
          <Modal.Header>
            <div className="flex items-center justify-between w-full">
              <span>Proforma #{selectedProforma?.id}</span>
              <div className="flex gap-2">
                {selectedProforma && (
                  <>
                    <PdfButton 
                      elementId="proforma-detail-content" 
                      filename={`proforma-${selectedProforma.id}`}
                    />
                    <PngButton 
                      elementId="proforma-detail-content" 
                      filename={`proforma-${selectedProforma.id}`}
                    />
                  </>
                )}
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            {selectedProforma && (
              <div className="space-y-6">
                {/* Contenido exportable */}
                <div id="proforma-detail-content" className="bg-white p-6 rounded-lg">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">PROFORMA</h2>
                    <p className="text-gray-600">#{selectedProforma.id}</p>
                  </div>

                  {/* Información del cliente */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Información del Cliente
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <Label value="Nombre" />
                          <p className="text-gray-900">{selectedProforma.cliente_nombre}</p>
                        </div>
                        {selectedProforma.cliente_telefono && (
                          <div>
                            <Label value="Teléfono" />
                            <p className="text-gray-900">{selectedProforma.cliente_telefono}</p>
                          </div>
                        )}
                        {selectedProforma.cliente_email && (
                          <div>
                            <Label value="Email" />
                            <p className="text-gray-900">{selectedProforma.cliente_email}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Información de la Proforma
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <Label value="Estado" />
                          <StatusPill status={selectedProforma.estado} />
                        </div>
                        <div>
                          <Label value="Fecha de Creación" />
                          <p className="text-gray-900">
                            {formatDateTime(selectedProforma.created_at)}
                          </p>
                        </div>
                        {selectedProforma.fecha_expiracion && (
                          <div>
                            <Label value="Fecha de Expiración" />
                            <p className={`${
                              isExpired(selectedProforma.fecha_expiracion) ? 'text-red-600' :
                              isExpiringSoon(selectedProforma.fecha_expiracion) ? 'text-yellow-600' :
                              'text-gray-900'
                            }`}>
                              {formatDateTime(selectedProforma.fecha_expiracion)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Líneas de la proforma */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Productos
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="px-6 py-3">Producto</th>
                            <th className="px-6 py-3">Precio Unit.</th>
                            <th className="px-6 py-3">Descuento</th>
                            <th className="px-6 py-3">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProforma.lineas?.map((linea, index) => (
                            <tr key={index} className="bg-white border-b">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {linea.saco?.tipo} - {linea.saco?.temporada}
                                  </p>
                                  <p className="text-gray-500">ID: {linea.saco?.id}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {formatCurrency(linea.precio_unitario)}
                              </td>
                              <td className="px-6 py-4">
                                {linea.descuento_linea}%
                              </td>
                              <td className="px-6 py-4 font-medium">
                                {formatCurrency(linea.subtotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Totales */}
                  <div className="border-t pt-4">
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        {selectedProforma.descuento_global > 0 && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Descuento Global:</span>
                            <span>{selectedProforma.descuento_global}%</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-semibold border-t pt-2">
                          <span>Total:</span>
                          <span>{formatCurrency(selectedProforma.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                {selectedProforma.estado === ProformaEstado.EMITIDA && (
                  <div className="flex justify-center">
                    <Button
                      color="success"
                      onClick={() => {
                        handleEmitir(selectedProforma.id)
                        setShowDetailModal(false)
                      }}
                    >
                      <HiCheck className="mr-2 h-4 w-4" />
                      Emitir como Reserva
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
        </Modal>
      </DashboardLayout>
    </AuthGuard>
  )
}