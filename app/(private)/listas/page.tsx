'use client'

import { useState } from 'react'
import { Button, Modal, Label, TextInput, Select, Card, Badge } from 'flowbite-react'
import { HiPlus, HiEye, HiLink, HiDownload, HiTrash } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DataTable } from '@/components/ui/DataTable'
import { SacoCard } from '@/components/ui/SacoCard'
import { PdfButton, PngButton } from '@/components/ui/ExportButtons'
import { AuthGuard } from '@/lib/auth-guard'
import { listasAPI, sacosAPI } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { UserRole, type Lista, type Saco, type TableColumn, ListaTipo, SacoEstado } from '@/types'
import { toast } from 'react-hot-toast'

const createListaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  tipo: z.nativeEnum(ListaTipo)
})

type CreateListaForm = z.infer<typeof createListaSchema>

export default function ListasPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddSacosModal, setShowAddSacosModal] = useState(false)
  const [selectedLista, setSelectedLista] = useState<Lista | null>(null)

  const { data: listas, mutate } = useSWR('/listas', () => listasAPI.getAll())
  const { data: sacosDisponibles } = useSWR('/sacos-disponibles', () => 
    sacosAPI.getAll(1, 100, { estado: SacoEstado.DISPONIBLE })
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateListaForm>({
    resolver: zodResolver(createListaSchema)
  })

  const columns: TableColumn<Lista>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (lista) => (
        <Badge color={lista.tipo === ListaTipo.VIP ? 'purple' : 'blue'}>
          {lista.tipo}
        </Badge>
      )
    },
    {
      key: 'activa',
      label: 'Estado',
      render: (lista) => (
        <Badge color={lista.activa ? 'success' : 'gray'}>
          {lista.activa ? 'Activa' : 'Inactiva'}
        </Badge>
      )
    },
    {
      key: 'sacos',
      label: 'Sacos',
      render: (lista) => lista.sacos?.length || 0
    },
    {
      key: 'enlace_publico',
      label: 'Enlace Público',
      render: (lista) => (
        lista.enlace_publico ? (
          <Badge color="success">Generado</Badge>
        ) : (
          <Badge color="gray">No generado</Badge>
        )
      )
    },
    {
      key: 'created_at',
      label: 'Fecha Creación',
      sortable: true,
      render: (lista) => formatDate(lista.created_at)
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (lista) => (
        <div className="flex gap-1">
          <Button
            size="xs"
            color="info"
            onClick={() => {
              setSelectedLista(lista)
              setShowDetailModal(true)
            }}
          >
            <HiEye className="h-3 w-3" />
          </Button>
          {!lista.enlace_publico && (
            <Button
              size="xs"
              color="success"
              onClick={() => handleGenerateLink(lista.id)}
            >
              <HiLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      )
    }
  ]

  const onSubmit = async (data: CreateListaForm) => {
    try {
      await listasAPI.create(data)
      toast.success('Lista creada exitosamente')
      setShowCreateModal(false)
      reset()
      mutate()
    } catch (error) {
      toast.error('Error al crear la lista')
    }
  }

  const handleGenerateLink = async (listaId: number) => {
    try {
      await listasAPI.generateEnlace(listaId)
      toast.success('Enlace público generado')
      mutate()
    } catch (error) {
      toast.error('Error al generar enlace')
    }
  }

  const handleActivateLista = async (listaId: number) => {
    try {
      await listasAPI.activate(listaId)
      toast.success('Lista activada')
      mutate()
    } catch (error) {
      toast.error('Error al activar lista')
    }
  }

  const handleAddSaco = async (sacoId: number) => {
    if (!selectedLista) return
    
    try {
      await listasAPI.addSaco(selectedLista.id, sacoId)
      toast.success('Saco agregado a la lista')
      mutate()
      // Actualizar la lista seleccionada
      const updatedLista = await listasAPI.getById(selectedLista.id)
      setSelectedLista(updatedLista)
    } catch (error) {
      toast.error('Error al agregar saco')
    }
  }

  const handleRemoveSaco = async (sacoId: number) => {
    if (!selectedLista) return
    
    try {
      await listasAPI.removeSaco(selectedLista.id, sacoId)
      toast.success('Saco removido de la lista')
      mutate()
      // Actualizar la lista seleccionada
      const updatedLista = await listasAPI.getById(selectedLista.id)
      setSelectedLista(updatedLista)
    } catch (error) {
      toast.error('Error al remover saco')
    }
  }

  const copyPublicLink = (enlace: string) => {
    const fullUrl = `${window.location.origin}/${enlace}`
    navigator.clipboard.writeText(fullUrl)
    toast.success('Enlace copiado al portapapeles')
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
                  <div className="text-3xl">📋</div>
                  <h1 className="jaguar-header-title">
                    Gestión de Listas
                  </h1>
                </div>
                <p className="jaguar-header-subtitle">
                   Administra las listas VIP y BASE para catálogos públicos
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
              >
                <HiPlus className="h-5 w-5" />
                <span>Nueva Lista</span>
              </button>
            </div>
          </div>

          <DataTable
            data={listas || []}
            columns={columns}
            searchPlaceholder="Buscar listas..."
            filters={[
              {
                key: 'tipo',
                label: 'Tipo',
                options: Object.values(ListaTipo).map(tipo => ({
                  value: tipo,
                  label: tipo
                }))
              }
            ]}
          />
        </div>

        {/* Modal Crear Lista */}
        <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <Modal.Header>Crear Nueva Lista</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="nombre" value="Nombre de la Lista" />
                <TextInput
                  id="nombre"
                  type="text"
                  placeholder="Ej: Lista VIP Enero 2024"
                  {...register('nombre')}
                  color={errors.nombre ? 'failure' : 'gray'}
                  helperText={errors.nombre?.message}
                />
              </div>

              <div>
                <Label htmlFor="tipo" value="Tipo de Lista" />
                <Select
                  id="tipo"
                  {...register('tipo')}
                  color={errors.tipo ? 'failure' : 'gray'}
                  helperText={errors.tipo?.message}
                >
                  <option value="">Selecciona el tipo</option>
                  {Object.values(ListaTipo).map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </Select>
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
                  {isSubmitting ? 'Creando...' : 'Crear Lista'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Modal Detalle Lista */}
        <Modal show={showDetailModal} onClose={() => setShowDetailModal(false)} size="4xl">
          <Modal.Header>
            <div className="flex items-center justify-between w-full">
              <span>Lista: {selectedLista?.nombre}</span>
              <div className="flex gap-2">
                {selectedLista && (
                  <>
                    <PdfButton 
                      elementId="lista-content" 
                      filename={`lista-${selectedLista.nombre}`}
                    />
                    <PngButton 
                      elementId="lista-content" 
                      filename={`lista-${selectedLista.nombre}`}
                    />
                  </>
                )}
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            {selectedLista && (
              <div className="space-y-6">
                {/* Información de la lista */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label value="Tipo" />
                    <Badge color={selectedLista.tipo === ListaTipo.VIP ? 'purple' : 'blue'}>
                      {selectedLista.tipo}
                    </Badge>
                  </div>
                  <div>
                    <Label value="Estado" />
                    <Badge color={selectedLista.activa ? 'success' : 'gray'}>
                      {selectedLista.activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>

                {/* Enlace público */}
                {selectedLista.enlace_publico && (
                  <div>
                    <Label value="Enlace Público" />
                    <div className="mt-2">
                      <div className="p-4 bg-jaguar-50 dark:bg-jaguar-900/20 rounded-lg border border-jaguar-200 dark:border-jaguar-700">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">🛒</span>
                          <Label value="Tienda Pública" className="text-lg font-semibold text-jaguar-700 dark:text-jaguar-300" />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <TextInput
                            value={`${window.location.origin}/tienda/${selectedLista.enlace_publico}`}
                            readOnly
                            className="flex-1 jaguar-input"
                          />
                          <Button
                            size="sm"
                            className="jaguar-button"
                            onClick={() => copyPublicLink(`tienda/${selectedLista.enlace_publico}`)}
                          >
                            Copiar Enlace
                          </Button>
                        </div>
                        <div className="mt-3 p-3 bg-jaguar-100 dark:bg-jaguar-800/30 rounded border-l-4 border-jaguar-400">
                          <p className="text-sm text-jaguar-700 dark:text-jaguar-300 font-medium">
                            📋 Instrucciones para clientes:
                          </p>
                          <ul className="text-xs text-jaguar-600 dark:text-jaguar-400 mt-1 space-y-1">
                            <li>• Precios fijos de $500 por conjunto</li>
                            <li>• Sin descuentos adicionales</li>
                            <li>• Genera código de seguimiento automático</li>
                            <li>• Pueden descargar su pedido en PDF/PNG</li>
                          </ul>
                        </div>
                        <div className="mt-3 p-3 bg-coffee-100 dark:bg-coffee-800/30 rounded border-l-4 border-coffee-500">
                          <p className="text-sm text-coffee-700 dark:text-coffee-300 font-medium">
                            💼 Para ventas con descuentos:
                          </p>
                          <p className="text-xs text-coffee-600 dark:text-coffee-400 mt-1">
                            Usa &quot;Crear Proforma Manual&quot; en el menú de Ventas para aplicar descuentos personalizados
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2">
                  {!selectedLista.activa && (
                    <Button
                      color="success"
                      onClick={() => handleActivateLista(selectedLista.id)}
                    >
                      Activar Lista
                    </Button>
                  )}
                  <Button
                    color="info"
                    onClick={() => setShowAddSacosModal(true)}
                  >
                    <HiPlus className="mr-2 h-4 w-4" />
                    Agregar Sacos
                  </Button>
                </div>

                {/* Contenido exportable */}
                <div id="lista-content" className="bg-white p-6 rounded-lg">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedLista.nombre}
                    </h2>
                    <p className="text-gray-600">Lista {selectedLista.tipo}</p>
                  </div>

                  {/* Sacos en la lista */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sacos en la Lista ({selectedLista.sacos?.length || 0})
                    </h3>
                    
                    {selectedLista.sacos && selectedLista.sacos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedLista.sacos.map(saco => (
                          <div key={saco.id} className="relative">
                            <SacoCard saco={saco} />
                            <Button
                              size="xs"
                              color="failure"
                              className="absolute top-2 right-2"
                              onClick={() => handleRemoveSaco(saco.id)}
                            >
                              <HiTrash className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No hay sacos en esta lista
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Modal Agregar Sacos */}
        <Modal show={showAddSacosModal} onClose={() => setShowAddSacosModal(false)} size="4xl">
          <Modal.Header>Agregar Sacos a la Lista</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona los sacos disponibles para agregar a la lista
              </p>
              
              {sacosDisponibles?.items && sacosDisponibles.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {sacosDisponibles.items.map(saco => (
                    <div key={saco.id} className="relative">
                      <SacoCard saco={saco} />
                      <Button
                        size="xs"
                        color="success"
                        className="absolute top-2 right-2"
                        onClick={() => handleAddSaco(saco.id)}
                      >
                        <HiPlus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay sacos disponibles para agregar
                </p>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </DashboardLayout>
    </AuthGuard>
  )
}