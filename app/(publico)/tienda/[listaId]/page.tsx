'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button, TextInput, Label, Modal } from 'flowbite-react'
import { HiShoppingCart, HiPlus, HiMinus } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SacoCard } from '@/components/ui/SacoCard'
import { PdfButton, PngButton } from '@/components/ui/ExportButtons'
import { listasAPI, proformasAPI } from '@/lib/api'
import { formatCurrency, getTipoColor, getTemporadaColor, getCategoriaColor } from '@/lib/utils'
import { type Lista, type Saco, SacoTipo, Temporada } from '@/types'
import { toast } from 'react-hot-toast'

const clienteSchema = z.object({
  cliente_nombre: z.string().min(1, 'El nombre es requerido'),
  cliente_telefono: z.string().optional(),
  cliente_email: z.string().email('Email inválido').optional().or(z.literal(''))
})

type ClienteForm = z.infer<typeof clienteSchema>

interface SacoSeleccionado extends Saco {
  cantidad: number
}

export default function TiendaPublicaPage() {
  const params = useParams()
  const listaId = params.listaId as string

  const [lista, setLista] = useState<Lista | null>(null)
  const [loading, setLoading] = useState(true)
  const [sacosSeleccionados, setSacosSeleccionados] = useState<SacoSeleccionado[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState<string>('')
  const [filtroTemporada, setFiltroTemporada] = useState<string>('')
  const [ordenPrecio, setOrdenPrecio] = useState<'asc' | 'desc' | ''>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema)
  })

  useEffect(() => {
    const fetchLista = async () => {
      try {
        const data = await listasAPI.getByEnlace(listaId)
        setLista(data)
      } catch (error) {
        toast.error('Catálogo no encontrado')
      } finally {
        setLoading(false)
      }
    }

    fetchLista()
  }, [listaId])

  const sacosFiltrados = lista?.sacos?.filter(saco => {
    if (filtroTipo && saco.tipo !== filtroTipo) return false
    if (filtroTemporada && saco.temporada !== filtroTemporada) return false
    return true
  }).sort((a, b) => {
    if (ordenPrecio === 'asc') return a.precio_base - b.precio_base
    if (ordenPrecio === 'desc') return b.precio_base - a.precio_base
    return 0
  }) || []

  const agregarSaco = (saco: Saco) => {
    const existente = sacosSeleccionados.find(s => s.id === saco.id)
    if (existente) {
      setSacosSeleccionados(prev =>
        prev.map(s => s.id === saco.id ?
          { ...s, cantidad: s.cantidad + 1 } : s
        )
      )
    } else {
      setSacosSeleccionados(prev => [...prev, {
        ...saco,
        cantidad: 1
      }])
    }
    toast.success('Producto agregado al carrito')
  }

  const removerSaco = (sacoId: number) => {
    setSacosSeleccionados(prev => prev.filter(s => s.id !== sacoId))
  }

  const actualizarCantidad = (sacoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removerSaco(sacoId)
      return
    }
    setSacosSeleccionados(prev =>
      prev.map(s => s.id === sacoId ? { ...s, cantidad } : s)
    )
  }

  const calcularTotal = () => {
    return sacosSeleccionados.reduce((acc, saco) => acc + (saco.precio_base * saco.cantidad), 0)
  }

  const onSubmit = async (data: ClienteForm) => {
    if (sacosSeleccionados.length === 0) {
      toast.error('Selecciona al menos un producto')
      return
    }

    try {
      const proformaData = {
        lista_id: lista?.id,
        cliente_nombre: data.cliente_nombre,
        cliente_telefono: data.cliente_telefono,
        cliente_email: data.cliente_email,
        descuento_global: 0, // Sin descuentos en tienda pública
        lineas: sacosSeleccionados.map(saco => ({
          saco_id: saco.id,
          precio_unitario: saco.precio_base, // Precio fijo sin modificaciones
          descuento_linea: 0 // Sin descuentos por línea
        }))
      }

      const proforma = await proformasAPI.create(proformaData)

      // Limpiar carrito
      setSacosSeleccionados([])
      setShowCheckout(false)

      // Mostrar información del pedido
      toast.success('¡Pedido creado exitosamente!')

      // Mostrar modal con código de seguimiento
      alert(`¡Tu pedido ha sido creado exitosamente!\n\nCódigo de seguimiento: ${proforma.codigo_seguimiento}\n\nTotal: ${formatCurrency(proforma.total)}\n\nPuedes hacer seguimiento de tu pedido en:\n${window.location.origin}/seguimiento`)

    } catch (error) {
      toast.error('Error al generar el pedido')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jaguar-50 via-white to-coffee-50 dark:from-dark-950 dark:via-dark-900 dark:to-coffee-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-jaguar-200 dark:border-coffee-600"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-jaguar-500 dark:border-jaguar-400 absolute top-0"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-coffee-700 dark:text-jaguar-300">
            Cargando tienda...
          </p>
          <p className="mt-2 text-sm text-coffee-500 dark:text-coffee-400">
            Preparando los mejores conjuntos para ti
          </p>
        </div>
      </div>
    )
  }

  if (!lista) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jaguar-50 via-white to-coffee-50 dark:from-dark-950 dark:via-dark-900 dark:to-coffee-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-3xl font-bold text-coffee-800 dark:text-jaguar-200 mb-4">
            Tienda no encontrada
          </h1>
          <p className="text-lg text-coffee-600 dark:text-coffee-300 mb-6">
            La tienda que buscas no existe o no está disponible en este momento.
          </p>
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-jaguar-200 dark:border-coffee-600">
            <p className="text-sm text-coffee-500 dark:text-coffee-400 mb-4">
              ¿Necesitas ayuda? Contáctanos:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-coffee-700 dark:text-jaguar-300">📞 +51 999 888 777</p>
              <p className="text-coffee-700 dark:text-jaguar-300">📧 soporte@tienda.com</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jaguar-50 via-white to-coffee-50 dark:from-dark-950 dark:via-dark-900 dark:to-coffee-950">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-jaguar-600 via-jaguar-500 to-coffee-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <img 
                  src="/logo_dorado_sin_nombre.png" 
                  alt="Jaguar Logo" 
                  className="h-12 w-12"
                />
                <span className="text-4xl">🛒</span>
                <h1 className="text-3xl lg:text-4xl font-bold text-dark-900">
                  {lista.nombre}
                </h1>
              </div>
              <p className="text-lg text-dark-800 mb-2">
                Tienda Online - {lista.sacos?.length || 0} conjuntos disponibles
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="bg-dark-900/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-dark-900 font-bold text-lg">
                    💰 Precio fijo: $500 por conjunto
                  </span>
                </div>
                <div className="bg-dark-900/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-dark-900 font-medium">
                    📦 Múltiples prendas incluidas
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* Carrito */}
              <Button
                onClick={() => setShowCheckout(true)}
                disabled={sacosSeleccionados.length === 0}
                className={`bg-dark-900 hover:bg-dark-800 text-jaguar-300 border-2 border-dark-900 hover:border-dark-700 shadow-xl transition-all duration-200 min-w-[200px] ${sacosSeleccionados.length > 0 ? 'animate-pulse' : ''
                  }`}
              >
                <HiShoppingCart className="mr-2 h-5 w-5" />
                Carrito ({sacosSeleccionados.length})
                {sacosSeleccionados.length > 0 && (
                  <span className="ml-2 bg-jaguar-400 text-dark-900 px-2 py-1 rounded-full text-sm font-bold">
                    {formatCurrency(calcularTotal())}
                  </span>
                )}
              </Button>

              {/* Enlace de seguimiento */}
              <a
                href="/seguimiento"
                className="text-dark-900 hover:text-dark-800 text-sm font-medium underline transition-colors"
              >
                🔍 Hacer seguimiento de mi pedido
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros mejorados */}
        <div className="mb-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-jaguar-200 dark:border-coffee-600 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="min-w-[160px]">
                <label className="block text-sm font-medium text-coffee-700 dark:text-jaguar-300 mb-1">
                  🏷️ Tipo de conjunto
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full rounded-lg border-jaguar-300 dark:border-coffee-600 dark:bg-dark-700 text-coffee-800 dark:text-jaguar-200 focus:border-jaguar-500 focus:ring-jaguar-500"
                >
                  <option value="">Todos los tipos</option>
                  {Object.values(SacoTipo).map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-coffee-700 dark:text-jaguar-300 mb-1">
                  🌤️ Temporada
                </label>
                <select
                  value={filtroTemporada}
                  onChange={(e) => setFiltroTemporada(e.target.value)}
                  className="w-full rounded-lg border-jaguar-300 dark:border-coffee-600 dark:bg-dark-700 text-coffee-800 dark:text-jaguar-200 focus:border-jaguar-500 focus:ring-jaguar-500"
                >
                  <option value="">Todas</option>
                  {Object.values(Temporada).map(temporada => (
                    <option key={temporada} value={temporada}>{temporada}</option>
                  ))}
                </select>
              </div>

              <div className="min-w-[160px]">
                <label className="block text-sm font-medium text-coffee-700 dark:text-jaguar-300 mb-1">
                  📊 Ordenar por
                </label>
                <select
                  value={ordenPrecio}
                  onChange={(e) => setOrdenPrecio(e.target.value as 'asc' | 'desc' | '')}
                  className="w-full rounded-lg border-jaguar-300 dark:border-coffee-600 dark:bg-dark-700 text-coffee-800 dark:text-jaguar-200 focus:border-jaguar-500 focus:ring-jaguar-500"
                >
                  <option value="">Orden original</option>
                  <option value="asc">A-Z (Alfabético)</option>
                  <option value="desc">Z-A (Alfabético)</option>
                </select>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="flex items-center gap-4">
              {(filtroTipo || filtroTemporada) && (
                <button
                  onClick={() => {
                    setFiltroTipo('')
                    setFiltroTemporada('')
                    setOrdenPrecio('')
                  }}
                  className="text-sm text-coffee-600 dark:text-jaguar-400 hover:text-coffee-800 dark:hover:text-jaguar-200 underline"
                >
                  Limpiar filtros
                </button>
              )}
              <div className="text-sm font-medium text-coffee-700 dark:text-jaguar-300 bg-jaguar-100 dark:bg-coffee-700 px-3 py-1 rounded-full">
                {sacosFiltrados.length} productos
              </div>
            </div>
          </div>
        </div>

        {/* Productos en formato tabla */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg overflow-hidden border border-jaguar-200 dark:border-coffee-600">
          {sacosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-coffee-400 mb-4">
                <HiShoppingCart className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-jaguar-100">
                No hay productos disponibles
              </h3>
              <p className="text-gray-500 dark:text-coffee-300 mt-2">
                No se encontraron productos con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <>
              {/* Header de la tabla */}
              <div className="bg-jaguar-100 dark:bg-coffee-800 px-6 py-4 border-b border-jaguar-200 dark:border-coffee-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-coffee-800 dark:text-jaguar-200">
                    Productos Disponibles ({sacosFiltrados.length})
                  </h3>
                  <div className="text-sm text-coffee-600 dark:text-jaguar-300">
                    Precio fijo: <span className="font-bold text-jaguar-600 dark:text-jaguar-200">$500</span> por conjunto
                  </div>
                </div>
              </div>

              {/* Lista de productos */}
              <div className="divide-y divide-jaguar-100 dark:divide-coffee-700">
                {sacosFiltrados.map((saco, index) => (
                  <div
                    key={saco.id}
                    className={`px-6 py-4 hover:bg-jaguar-50 dark:hover:bg-coffee-900/30 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-dark-800' : 'bg-jaguar-25 dark:bg-dark-850'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-jaguar-400 to-jaguar-600 rounded-lg flex items-center justify-center">
                              <span className="text-dark-900 font-bold text-lg">
                                {saco.tipo.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-jaguar-100 truncate">
                              {saco.tipo.replace('_', ' ')} - {saco.temporada}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTipoColor(saco.tipo)}`}>
                                {saco.tipo.replace('_', ' ')}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTemporadaColor(saco.temporada)}`}>
                                {saco.temporada}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoriaColor(saco.categoria)}`}>
                                {saco.categoria}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Detalles del conjunto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-sm font-medium text-coffee-700 dark:text-jaguar-300 mb-1">
                              📦 Incluye:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {saco.prendas_incluidas?.map((prenda, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-jaguar-100 text-coffee-700 dark:bg-coffee-700 dark:text-jaguar-200"
                                >
                                  {prenda}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-coffee-700 dark:text-jaguar-300 mb-1">
                              📏 Tallas disponibles:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {saco.tallas_incluidas?.map((talla, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-coffee-100 text-coffee-800 dark:bg-coffee-800 dark:text-coffee-200 font-medium"
                                >
                                  {talla}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {saco.observaciones && (
                          <div className="mt-3">
                            <p className="text-sm text-coffee-600 dark:text-coffee-300">
                              💬 {saco.observaciones}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Precio y botón de agregar */}
                      <div className="flex-shrink-0 ml-6 text-right">
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-jaguar-600 dark:text-jaguar-300">
                            {formatCurrency(saco.precio_base)}
                          </div>
                          <div className="text-sm text-coffee-500 dark:text-coffee-400">
                            Precio fijo
                          </div>
                        </div>

                        <Button
                          onClick={() => agregarSaco(saco)}
                          className="bg-gradient-to-r from-jaguar-400 to-jaguar-500 hover:from-jaguar-500 hover:to-jaguar-600 text-dark-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 min-w-[120px]"
                        >
                          <HiPlus className="mr-2 h-4 w-4" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer con resumen */}
              <div className="bg-jaguar-50 dark:bg-coffee-800 px-6 py-4 border-t border-jaguar-200 dark:border-coffee-600">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-coffee-600 dark:text-jaguar-300">
                    Mostrando {sacosFiltrados.length} de {lista?.sacos?.length || 0} productos
                  </div>
                  <div className="text-coffee-700 dark:text-jaguar-200 font-medium">
                    💡 Todos los conjuntos incluyen múltiples prendas por $500
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Checkout Simplificado */}
      <Modal show={showCheckout} onClose={() => setShowCheckout(false)} size="3xl">
        <Modal.Header>
          <div className="flex items-center justify-between w-full">
            <span>Finalizar Pedido</span>
            <div className="flex gap-2">
              <PdfButton
                elementId="pedido-content"
                filename={`pedido-${lista.nombre}`}
              />
              <PngButton
                elementId="pedido-content"
                filename={`pedido-${lista.nombre}`}
              />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {/* Datos del cliente */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente_nombre" value="Nombre Completo *" />
                  <TextInput
                    id="cliente_nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    {...register('cliente_nombre')}
                    color={errors.cliente_nombre ? 'failure' : 'gray'}
                    helperText={errors.cliente_nombre?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="cliente_telefono" value="Teléfono" />
                  <TextInput
                    id="cliente_telefono"
                    type="tel"
                    placeholder="Tu número de teléfono"
                    {...register('cliente_telefono')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cliente_email" value="Email (opcional)" />
                <TextInput
                  id="cliente_email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register('cliente_email')}
                  color={errors.cliente_email ? 'failure' : 'gray'}
                  helperText={errors.cliente_email?.message}
                />
              </div>

              {/* Contenido exportable */}
              <div id="pedido-content" className="bg-white p-6 rounded-lg">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">PEDIDO</h2>
                  <p className="text-gray-600">{lista.nombre}</p>
                  <p className="text-sm text-gray-500">Tienda Online</p>
                </div>

                {/* Productos seleccionados */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Productos Seleccionados
                  </h3>

                  {sacosSeleccionados.map(saco => (
                    <div key={saco.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {saco.tipo.replace('_', ' ')} - {saco.temporada}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Incluye: {saco.prendas_incluidas?.join(', ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tallas: {saco.tallas_incluidas?.join(', ')}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => actualizarCantidad(saco.id, saco.cantidad - 1)}
                            >
                              <HiMinus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{saco.cantidad}</span>
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => actualizarCantidad(saco.id, saco.cantidad + 1)}
                            >
                              <HiPlus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(saco.precio_base)}
                            </p>
                            <p className="text-sm text-gray-500">c/u</p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatCurrency(saco.precio_base * saco.cantidad)}
                            </p>
                          </div>

                          <Button
                            size="xs"
                            color="failure"
                            onClick={() => removerSaco(saco.id)}
                          >
                            <HiMinus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total a Pagar:</span>
                      <span className="text-primary-600">{formatCurrency(calcularTotal())}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Precios fijos sin descuentos adicionales
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  color="gray"
                  onClick={() => setShowCheckout(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || sacosSeleccionados.length === 0}
                  className="bg-primary-400 hover:bg-primary-500 text-gray-900"
                >
                  {isSubmitting ? 'Generando...' : 'Confirmar Pedido'}
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}