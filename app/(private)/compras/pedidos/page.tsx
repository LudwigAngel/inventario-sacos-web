'use client'

import { useState } from 'react'
import { Button, Modal, Label, TextInput, Select, Textarea } from 'flowbite-react'
import { HiPlus, HiEye } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/DataTable'
import { StatusPill } from '@/components/ui/StatusPill'
import { AuthGuard } from '@/lib/auth-guard'
import { pedidosAPI, proveedoresAPI } from '@/lib/api'
import { formatDate, formatCurrency } from '@/lib/utils'
import { UserRole, type Pedido, type Proveedor, type TableColumn, PedidoEstado } from '@/types'
import { toast } from 'react-hot-toast'

const createPedidoSchema = z.object({
  proveedor_id: z.number().min(1, 'Selecciona un proveedor'),
  fecha_entrega_estimada: z.string().optional(),
  observaciones: z.string().optional()
})

type CreatePedidoForm = z.infer<typeof createPedidoSchema>

export default function PedidosPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const { data: pedidos, mutate } = useSWR('/pedidos', () => pedidosAPI.getAll())
  const { data: proveedores } = useSWR('/proveedores', () => proveedoresAPI.getAll())

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreatePedidoForm>({
    resolver: zodResolver(createPedidoSchema)
  })

  const columns: TableColumn<Pedido>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'proveedor',
      label: 'Proveedor',
      render: (pedido) => pedido.proveedor?.nombre || 'N/A'
    },
    {
      key: 'fecha_pedido',
      label: 'Fecha Pedido',
      sortable: true,
      render: (pedido) => formatDate(pedido.fecha_pedido)
    },
    {
      key: 'fecha_entrega_estimada',
      label: 'Entrega Estimada',
      render: (pedido) => pedido.fecha_entrega_estimada ? formatDate(pedido.fecha_entrega_estimada) : 'N/A'
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (pedido) => <StatusPill status={pedido.estado} />
    },
    {
      key: 'total_sacos',
      label: 'Total Sacos',
      render: (pedido) => pedido.total_sacos || 0
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (pedido) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            color="info"
            onClick={() => {
              setSelectedPedido(pedido)
              setShowDetailModal(true)
            }}
          >
            <HiEye className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const onSubmit = async (data: CreatePedidoForm) => {
    try {
      await pedidosAPI.create(data)
      toast.success('Pedido creado exitosamente')
      setShowCreateModal(false)
      reset()
      mutate()
    } catch (error) {
      toast.error('Error al crear el pedido')
    }
  }

  const handleUpdateEstado = async (pedidoId: number, nuevoEstado: PedidoEstado) => {
    try {
      await pedidosAPI.updateEstado(pedidoId, nuevoEstado)
      toast.success('Estado actualizado')
      mutate()
      setShowDetailModal(false)
    } catch (error) {
      toast.error('Error al actualizar estado')
    }
  }

  return (
    <AuthGuard requiredRoles={[UserRole.ADMIN, UserRole.COMPRAS]}>
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
                  <div className="text-3xl">🛒</div>
                  <h1 className="jaguar-header-title">
                    Pedidos a Proveedores
                  </h1>
                </div>
                <p className="jaguar-header-subtitle">
                   Gestiona los pedidos realizados a proveedores
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
              >
                <HiPlus className="h-5 w-5" />
                <span>Nuevo Pedido</span>
              </button>
            </div>
          </div>

          <DataTable
            data={pedidos?.items || []}
            columns={columns}
            searchPlaceholder="Buscar pedidos..."
            filters={[
              {
                key: 'estado',
                label: 'Estado',
                options: Object.values(PedidoEstado).map(estado => ({
                  value: estado,
                  label: estado
                }))
              }
            ]}
          />
        </div>

        {/* Modal Crear Pedido */}
        <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <Modal.Header>Crear Nuevo Pedido</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="proveedor_id" value="Proveedor" />
                <Select
                  id="proveedor_id"
                  {...register('proveedor_id', { valueAsNumber: true })}
                  color={errors.proveedor_id ? 'failure' : 'gray'}
                  helperText={errors.proveedor_id?.message}
                >
                  <option value="">Selecciona un proveedor</option>
                  {proveedores?.map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="fecha_entrega_estimada" value="Fecha Entrega Estimada" />
                <TextInput
                  id="fecha_entrega_estimada"
                  type="date"
                  {...register('fecha_entrega_estimada')}
                />
              </div>

              <div>
                <Label htmlFor="observaciones" value="Observaciones" />
                <Textarea
                  id="observaciones"
                  rows={3}
                  {...register('observaciones')}
                  placeholder="Observaciones adicionales..."
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
                  {isSubmitting ? 'Creando...' : 'Crear Pedido'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Modal Detalle Pedido */}
        <Modal show={showDetailModal} onClose={() => setShowDetailModal(false)} size="lg">
          <Modal.Header>Detalle del Pedido #{selectedPedido?.id}</Modal.Header>
          <Modal.Body>
            {selectedPedido && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label value="Proveedor" />
                    <p className="text-gray-900 dark:text-white">
                      {selectedPedido.proveedor?.nombre}
                    </p>
                  </div>
                  <div>
                    <Label value="Estado Actual" />
                    <StatusPill status={selectedPedido.estado} />
                  </div>
                  <div>
                    <Label value="Fecha Pedido" />
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(selectedPedido.fecha_pedido)}
                    </p>
                  </div>
                  <div>
                    <Label value="Entrega Estimada" />
                    <p className="text-gray-900 dark:text-white">
                      {selectedPedido.fecha_entrega_estimada ? 
                        formatDate(selectedPedido.fecha_entrega_estimada) : 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedPedido.observaciones && (
                  <div>
                    <Label value="Observaciones" />
                    <p className="text-gray-900 dark:text-white">
                      {selectedPedido.observaciones}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <Label value="Cambiar Estado" />
                  <div className="flex gap-2 mt-2">
                    {Object.values(PedidoEstado).map(estado => (
                      <Button
                        key={estado}
                        size="sm"
                        color={selectedPedido.estado === estado ? 'success' : 'gray'}
                        onClick={() => handleUpdateEstado(selectedPedido.id, estado)}
                        disabled={selectedPedido.estado === estado}
                      >
                        {estado}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </DashboardLayout>
    </AuthGuard>
  )
}