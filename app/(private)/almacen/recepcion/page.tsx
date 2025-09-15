'use client'

import { useState } from 'react'
import { Button, Modal, Label, TextInput, Select, Textarea } from 'flowbite-react'
import { HiPlus, HiQrcode } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/DataTable'
import { SacoCard } from '@/components/ui/SacoCard'
import { MoneyInput } from '@/components/ui/MoneyInput'
import { AuthGuard } from '@/lib/auth-guard'
import { sacosAPI, pedidosAPI } from '@/lib/api'
import { formatDate, formatCurrency } from '@/lib/utils'
import { UserRole, type Saco, type TableColumn, SacoTipo, Temporada, Categoria, PedidoEstado } from '@/types'
import { toast } from 'react-hot-toast'

const createSacoSchema = z.object({
  pedido_id: z.number().optional(),
  tipo: z.nativeEnum(SacoTipo),
  temporada: z.nativeEnum(Temporada),
  categoria: z.nativeEnum(Categoria),
  tallas_incluidas: z.array(z.string()).min(1, 'Debe incluir al menos una talla'),
  descripcion_contenido: z.string().min(1, 'La descripción es requerida'),
  precio_base: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  observaciones: z.string().optional()
})

type CreateSacoForm = z.infer<typeof createSacoSchema>

export default function RecepcionPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  const { data: sacos, mutate } = useSWR('/sacos', () => sacosAPI.getAll())
  const { data: pedidos } = useSWR('/pedidos', () => pedidosAPI.getAll())

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateSacoForm>({
    resolver: zodResolver(createSacoSchema)
  })

  const precioBase = watch('precio_base')

  const columns: TableColumn<Saco>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'qr_code',
      label: 'QR Code',
      render: (saco) => (
        <div className="flex items-center gap-2">
          <HiQrcode className="h-4 w-4" />
          <span className="font-mono text-sm">{saco.qr_code}</span>
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (saco) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>
          {saco.tipo}
        </span>
      )
    },
    {
      key: 'temporada',
      label: 'Temporada',
      render: (saco) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          saco.temporada === 'VERANO' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        }`}>
          {saco.temporada}
        </span>
      )
    },
    {
      key: 'precio_base',
      label: 'Precio Base',
      sortable: true,
      render: (saco) => formatCurrency(saco.precio_base)
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (saco) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          saco.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
          saco.estado === 'RESERVADO' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
          saco.estado === 'VENDIDO' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        }`}>
          {saco.estado}
        </span>
      )
    },
    {
      key: 'pedido',
      label: 'Pedido',
      render: (saco) => saco.pedido_id ? `#${saco.pedido_id}` : 'Manual'
    },
    {
      key: 'created_at',
      label: 'Fecha Recepción',
      sortable: true,
      render: (saco) => formatDate(saco.created_at)
    }
  ]

  const onSubmit = async (data: CreateSacoForm) => {
    try {
      await sacosAPI.create(data)
      toast.success('Saco registrado exitosamente')
      setShowCreateModal(false)
      reset()
      mutate()
    } catch (error) {
      toast.error('Error al registrar el saco')
    }
  }

  const pedidosEnTransito = pedidos?.items?.filter(p => 
    p.estado === PedidoEstado.EN_TRANSITO || p.estado === PedidoEstado.RECIBIDO
  ) || []

  return (
    <AuthGuard requiredRoles={[UserRole.ADMIN, UserRole.ALMACEN]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="jaguar-header">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <img 
                    src="/logo_dorado_sin_nombre.png" 
                    alt="Jaguar Logo" 
                    className="h-8 w-8"
                  />
                  <div className="text-2xl">📦</div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                    Recepción de Sacos
                  </h1>
                </div>
                <p className="jaguar-header-subtitle">
                   Registra los sacos recibidos en el almacén
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                  className="px-4 py-2 bg-white dark:bg-amber-900/20 border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors duration-200 font-medium shadow-sm"
                >
                  {viewMode === 'table' ? '🎴 Vista Tarjetas' : '📊 Vista Tabla'}
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <HiPlus className="h-5 w-5" />
                  <span>Registrar Saco</span>
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <DataTable
              data={sacos?.items || []}
              columns={columns}
              searchPlaceholder="Buscar sacos..."
              filters={[
                {
                  key: 'tipo',
                  label: 'Tipo',
                  options: Object.values(SacoTipo).map(tipo => ({
                    value: tipo,
                    label: tipo
                  }))
                },
                {
                  key: 'temporada',
                  label: 'Temporada',
                  options: Object.values(Temporada).map(temporada => ({
                    value: temporada,
                    label: temporada
                  }))
                }
              ]}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sacos?.items?.map(saco => (
                <SacoCard key={saco.id} saco={saco} showQR />
              ))}
            </div>
          )}
        </div>

        {/* Modal Registrar Saco */}
        <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <Modal.Header>Registrar Nuevo Saco</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="pedido_id" value="Pedido (Opcional)" />
                <Select
                  id="pedido_id"
                  {...register('pedido_id', { valueAsNumber: true })}
                >
                  <option value="">Registro manual (sin pedido)</option>
                  {pedidosEnTransito.map(pedido => (
                    <option key={pedido.id} value={pedido.id}>
                      #{pedido.id} - {pedido.proveedor?.nombre} ({pedido.estado})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo" value="Tipo de Saco" />
                  <Select
                    id="tipo"
                    {...register('tipo')}
                    color={errors.tipo ? 'failure' : 'gray'}
                    helperText={errors.tipo?.message}
                  >
                    <option value="">Selecciona el tipo</option>
                    {Object.values(SacoTipo).map(tipo => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor="temporada" value="Temporada" />
                  <Select
                    id="temporada"
                    {...register('temporada')}
                    color={errors.temporada ? 'failure' : 'gray'}
                    helperText={errors.temporada?.message}
                  >
                    <option value="">Selecciona la temporada</option>
                    {Object.values(Temporada).map(temporada => (
                      <option key={temporada} value={temporada}>
                        {temporada}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="precio_base" value="Precio Base" />
                <MoneyInput
                  value={precioBase || 0}
                  onChange={(value) => setValue('precio_base', value)}
                  placeholder="0.00"
                />
                {errors.precio_base && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.precio_base.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="observaciones" value="Observaciones" />
                <Textarea
                  id="observaciones"
                  rows={3}
                  {...register('observaciones')}
                  placeholder="Observaciones sobre el saco..."
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
                  {isSubmitting ? 'Registrando...' : 'Registrar Saco'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </DashboardLayout>
    </AuthGuard>
  )
}