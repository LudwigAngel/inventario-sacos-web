'use client'

import { useState } from 'react'
import { Button, Modal, Label, Select, Textarea, TextInput } from 'flowbite-react'
import { HiPencil, HiCheck, HiQrcode } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/DataTable'
import { SacoCard } from '@/components/ui/SacoCard'
import { MoneyInput } from '@/components/ui/MoneyInput'
import { QrBadge } from '@/components/ui/QrBadge'
import { AuthGuard } from '@/lib/auth-guard'
import { sacosAPI } from '@/lib/api'
import { formatDate, formatCurrency } from '@/lib/utils'
import { UserRole, type Saco, type TableColumn, SacoTipo, Temporada, SacoEstado } from '@/types'
import { toast } from 'react-hot-toast'

const updateSacoSchema = z.object({
  tipo: z.nativeEnum(SacoTipo),
  temporada: z.nativeEnum(Temporada),
  precio_base: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  observaciones: z.string().optional()
})

type UpdateSacoForm = z.infer<typeof updateSacoSchema>

export default function EtiquetadoPage() {
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSaco, setSelectedSaco] = useState<Saco | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  const { data: sacos, mutate } = useSWR('/sacos', () => 
    sacosAPI.getAll(1, 50, { estado: SacoEstado.RECIBIDO })
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<UpdateSacoForm>({
    resolver: zodResolver(updateSacoSchema)
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
          <QrBadge value={saco.qr_code} size={40} />
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
          {saco.estado}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Fecha Recepción',
      sortable: true,
      render: (saco) => formatDate(saco.created_at)
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (saco) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            color="warning"
            onClick={() => handleEditSaco(saco)}
          >
            <HiPencil className="h-4 w-4" />
          </Button>
          <Button
            size="xs"
            color="success"
            onClick={() => handleMarkAsAvailable(saco.id)}
          >
            <HiCheck className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const handleEditSaco = (saco: Saco) => {
    setSelectedSaco(saco)
    setValue('tipo', saco.tipo)
    setValue('temporada', saco.temporada)
    setValue('precio_base', saco.precio_base)
    setValue('observaciones', saco.observaciones || '')
    setShowEditModal(true)
  }

  const handleMarkAsAvailable = async (sacoId: number) => {
    try {
      await sacosAPI.updateEstado(sacoId, SacoEstado.DISPONIBLE)
      toast.success('Saco marcado como disponible')
      mutate()
    } catch (error) {
      toast.error('Error al actualizar el estado')
    }
  }

  const onSubmit = async (data: UpdateSacoForm) => {
    if (!selectedSaco) return

    try {
      await sacosAPI.update(selectedSaco.id, data)
      toast.success('Saco actualizado exitosamente')
      setShowEditModal(false)
      reset()
      mutate()
    } catch (error) {
      toast.error('Error al actualizar el saco')
    }
  }

  const handleBulkMarkAvailable = async () => {
    try {
      const promises = sacos?.items?.map(saco => 
        sacosAPI.updateEstado(saco.id, SacoEstado.DISPONIBLE)
      ) || []
      
      await Promise.all(promises)
      toast.success('Todos los sacos marcados como disponibles')
      mutate()
    } catch (error) {
      toast.error('Error al actualizar los sacos')
    }
  }

  return (
    <AuthGuard requiredRoles={[UserRole.ADMIN, UserRole.ALMACEN]}>
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
                  <div className="text-3xl">🏷️</div>
                  <h1 className="jaguar-header-title">
                    Etiquetado y Correcciones
                  </h1>
                </div>
                <p className="jaguar-header-subtitle">
                   Corrige información de sacos y márcalos como disponibles
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                  className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors duration-200 font-medium shadow-sm"
                >
                  {viewMode === 'table' ? '🎴 Vista Tarjetas' : '📊 Vista Tabla'}
                </button>
                {sacos?.items && sacos.items.length > 0 && (
                  <button
                    onClick={handleBulkMarkAvailable}
                    className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-green-900 rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
                  >
                    <HiCheck className="h-5 w-5" />
                    <span>Marcar Todos Disponibles</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {sacos?.items && sacos.items.length === 0 ? (
            <div className="text-center py-12">
              <HiCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No hay sacos pendientes
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Todos los sacos han sido procesados y están disponibles.
              </p>
            </div>
          ) : viewMode === 'table' ? (
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
                <div key={saco.id} className="relative">
                  <SacoCard saco={saco} showQR />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="xs"
                      color="warning"
                      onClick={() => handleEditSaco(saco)}
                    >
                      <HiPencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="xs"
                      color="success"
                      onClick={() => handleMarkAsAvailable(saco.id)}
                    >
                      <HiCheck className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Editar Saco */}
        <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
          <Modal.Header>
            Editar Saco #{selectedSaco?.id}
          </Modal.Header>
          <Modal.Body>
            {selectedSaco && (
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <QrBadge value={selectedSaco.qr_code} size={120} />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipo" value="Tipo de Saco" />
                      <Select
                        id="tipo"
                        {...register('tipo')}
                        color={errors.tipo ? 'failure' : 'gray'}
                        helperText={errors.tipo?.message}
                      >
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
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary-400 hover:bg-primary-500 text-gray-900"
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    <Button
                      color="success"
                      onClick={() => {
                        handleSubmit(onSubmit)()
                        handleMarkAsAvailable(selectedSaco.id)
                      }}
                      disabled={isSubmitting}
                    >
                      Guardar y Marcar Disponible
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </DashboardLayout>
    </AuthGuard>
  )
}