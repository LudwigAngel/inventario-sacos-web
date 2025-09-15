'use client'

import { useState } from 'react'
import { Button, Modal, Label, TextInput, Select, FileInput, Textarea } from 'flowbite-react'
import { HiPlus, HiEye, HiDownload } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/DataTable'
import { StatusPill } from '@/components/ui/StatusPill'
import { MoneyInput } from '@/components/ui/MoneyInput'
import { AuthGuard } from '@/lib/auth-guard'
import { pagosAPI, proformasAPI } from '@/lib/api'
import { formatDate, formatCurrency, formatDateTime } from '@/lib/utils'
import { UserRole, type Pago, type Proforma, type TableColumn, ProformaEstado } from '@/types'
import { toast } from 'react-hot-toast'

const createPagoSchema = z.object({
  proforma_id: z.number().min(1, 'Selecciona una proforma'),
  monto: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  metodo_pago: z.string().min(1, 'Selecciona un método de pago'),
  voucher: z.any().optional(),
  observaciones: z.string().optional()
})

type CreatePagoForm = z.infer<typeof createPagoSchema>

export default function PagosPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProforma, setSelectedProforma] = useState<Proforma | null>(null)
  const [showProformaModal, setShowProformaModal] = useState(false)
  const [proformaPagos, setProformaPagos] = useState<Pago[]>([])

  const { data: proformas } = useSWR('/proformas-pagables', () => 
    proformasAPI.getAll().then(res => ({
      ...res,
      items: res.items.filter(p => 
        p.estado === ProformaEstado.RESERVA || p.estado === ProformaEstado.PAGADA
      )
    }))
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreatePagoForm>({
    resolver: zodResolver(createPagoSchema)
  })

  const monto = watch('monto')
  const proformaId = watch('proforma_id')

  const columns: TableColumn<Proforma>[] = [
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
      key: 'saldo_pendiente',
      label: 'Saldo Pendiente',
      render: (proforma) => {
        // Calcular saldo pendiente (esto debería venir del backend)
        const saldoPendiente = proforma.total // Simplificado
        return (
          <span className={saldoPendiente > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
            {formatCurrency(saldoPendiente)}
          </span>
        )
      }
    },
    {
      key: 'created_at',
      label: 'Fecha',
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
            onClick={() => handleViewProforma(proforma)}
          >
            <HiEye className="h-4 w-4" />
          </Button>
          <Button
            size="xs"
            color="success"
            onClick={() => {
              setValue('proforma_id', proforma.id)
              setShowCreateModal(true)
            }}
          >
            <HiPlus className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const handleViewProforma = async (proforma: Proforma) => {
    try {
      const pagos = await pagosAPI.getByProforma(proforma.id)
      setSelectedProforma(proforma)
      setProformaPagos(pagos)
      setShowProformaModal(true)
    } catch (error) {
      toast.error('Error al cargar los pagos')
    }
  }

  const onSubmit = async (data: CreatePagoForm) => {
    try {
      await pagosAPI.create(data)
      toast.success('Pago registrado exitosamente')
      setShowCreateModal(false)
      reset()
      // Refrescar datos
      window.location.reload()
    } catch (error) {
      toast.error('Error al registrar el pago')
    }
  }

  const selectedProformaData = proformas?.items.find(p => p.id === proformaId)

  return (
    <AuthGuard requiredRoles={[UserRole.ADMIN, UserRole.PAGOS]}>
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
                  <div className="text-3xl">💳</div>
                  <h1 className="jaguar-header-title">
                    Gestión de Pagos
                  </h1>
                </div>
                <p className="jaguar-header-subtitle">
                   Registra y administra los pagos de las proformas
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
              >
                <HiPlus className="h-5 w-5" />
                <span>Registrar Pago</span>
              </button>
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
                options: [
                  { value: ProformaEstado.RESERVA, label: 'RESERVA' },
                  { value: ProformaEstado.PAGADA, label: 'PAGADA' }
                ]
              }
            ]}
          />
        </div>

        {/* Modal Registrar Pago */}
        <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <Modal.Header>Registrar Nuevo Pago</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="proforma_id" value="Proforma" />
                <Select
                  id="proforma_id"
                  {...register('proforma_id', { valueAsNumber: true })}
                  color={errors.proforma_id ? 'failure' : 'gray'}
                  helperText={errors.proforma_id?.message}
                >
                  <option value="">Selecciona una proforma</option>
                  {proformas?.items.map(proforma => (
                    <option key={proforma.id} value={proforma.id}>
                      #{proforma.id} - {proforma.cliente_nombre} - {formatCurrency(proforma.total)}
                    </option>
                  ))}
                </Select>
              </div>

              {selectedProformaData && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Información de la Proforma
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Cliente:</span>
                      <p className="font-medium">{selectedProformaData.cliente_nombre}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Total:</span>
                      <p className="font-medium">{formatCurrency(selectedProformaData.total)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monto" value="Monto del Pago" />
                  <MoneyInput
                    value={monto || 0}
                    onChange={(value) => setValue('monto', value)}
                    placeholder="0.00"
                  />
                  {errors.monto && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.monto.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="metodo_pago" value="Método de Pago" />
                  <Select
                    id="metodo_pago"
                    {...register('metodo_pago')}
                    color={errors.metodo_pago ? 'failure' : 'gray'}
                    helperText={errors.metodo_pago?.message}
                  >
                    <option value="">Selecciona método</option>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="DEPOSITO">Depósito</option>
                    <option value="YAPE">Yape</option>
                    <option value="PLIN">Plin</option>
                    <option value="TARJETA">Tarjeta</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="voucher" value="Voucher (Opcional)" />
                <FileInput
                  id="voucher"
                  accept="image/*,.pdf"
                  helperText="Sube una imagen o PDF del voucher de pago"
                  {...register('voucher')}
                />
              </div>

              <div>
                <Label htmlFor="observaciones" value="Observaciones" />
                <Textarea
                  id="observaciones"
                  rows={3}
                  {...register('observaciones')}
                  placeholder="Observaciones adicionales sobre el pago..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  color="gray"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-400 hover:bg-primary-500 text-gray-900"
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Modal Detalle Proforma y Pagos */}
        <Modal show={showProformaModal} onClose={() => setShowProformaModal(false)} size="4xl">
          <Modal.Header>
            Proforma #{selectedProforma?.id} - Historial de Pagos
          </Modal.Header>
          <Modal.Body>
            {selectedProforma && (
              <div className="space-y-6">
                {/* Información de la proforma */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label value="Cliente" />
                    <p className="font-medium">{selectedProforma.cliente_nombre}</p>
                  </div>
                  <div>
                    <Label value="Total Proforma" />
                    <p className="font-medium">{formatCurrency(selectedProforma.total)}</p>
                  </div>
                  <div>
                    <Label value="Estado" />
                    <StatusPill status={selectedProforma.estado} />
                  </div>
                </div>

                {/* Historial de pagos */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Historial de Pagos
                  </h3>
                  
                  {proformaPagos.length > 0 ? (
                    <div className="space-y-4">
                      {proformaPagos.map((pago, index) => (
                        <div key={pago.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label value="Monto" />
                                  <p className="font-medium text-green-600">
                                    {formatCurrency(pago.monto)}
                                  </p>
                                </div>
                                <div>
                                  <Label value="Método" />
                                  <p className="font-medium">{pago.metodo_pago}</p>
                                </div>
                                <div>
                                  <Label value="Fecha" />
                                  <p>{formatDateTime(pago.created_at)}</p>
                                </div>
                                <div>
                                  <Label value="Voucher" />
                                  {pago.voucher_url ? (
                                    <Button
                                      size="xs"
                                      color="info"
                                      onClick={() => window.open(pago.voucher_url, '_blank')}
                                    >
                                      <HiDownload className="mr-1 h-3 w-3" />
                                      Ver
                                    </Button>
                                  ) : (
                                    <span className="text-gray-500">No disponible</span>
                                  )}
                                </div>
                              </div>
                              {pago.observaciones && (
                                <div className="mt-2">
                                  <Label value="Observaciones" />
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {pago.observaciones}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Resumen */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total Pagado:</span>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(proformaPagos.reduce((sum, pago) => sum + pago.monto, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-semibold">Saldo Pendiente:</span>
                          <span className="text-lg font-bold text-red-600">
                            {formatCurrency(
                              selectedProforma.total - 
                              proformaPagos.reduce((sum, pago) => sum + pago.monto, 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No hay pagos registrados para esta proforma
                    </p>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </DashboardLayout>
    </AuthGuard>
  )
}