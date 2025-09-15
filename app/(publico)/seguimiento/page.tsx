'use client'

import { useState } from 'react'
import { Button, Card, TextInput, Label } from 'flowbite-react'
import { HiSearch } from 'react-icons/hi'
import { StatusPill } from '@/components/ui/StatusPill'
import { proformasAPI } from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { type Proforma } from '@/types'
import { toast } from 'react-hot-toast'

export default function SeguimientoPage() {
  const [codigoSeguimiento, setCodigoSeguimiento] = useState('')
  const [proforma, setProforma] = useState<Proforma | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const buscarPedido = async () => {
    if (!codigoSeguimiento.trim()) {
      toast.error('Ingresa un código de seguimiento')
      return
    }

    setLoading(true)
    try {
      const proformaEncontrada = await proformasAPI.getByCodigo(codigoSeguimiento.trim())
      setProforma(proformaEncontrada)
      toast.success('Pedido encontrado')
      setSearched(true)
    } catch (error) {
      toast.error('No se encontró ningún pedido con ese código')
      setProforma(null)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoDescripcion = (estado: string) => {
    const descripciones: Record<string, string> = {
      EMITIDA: 'Tu pedido ha sido registrado y está siendo procesado.',
      RESERVA: 'Tu pedido está reservado. Tienes tiempo limitado para completar el pago.',
      PAGADA: 'El pago ha sido confirmado. Tu pedido está siendo preparado para el despacho.',
      VENCIDA: 'El tiempo de reserva ha expirado. Contacta con nosotros para renovar tu pedido.',
      DESPACHADA: '¡Tu pedido ha sido despachado! Pronto lo recibirás.'
    }
    return descripciones[estado] || 'Estado desconocido'
  }

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      EMITIDA: 'text-blue-600',
      RESERVA: 'text-yellow-600',
      PAGADA: 'text-green-600',
      VENCIDA: 'text-red-600',
      DESPACHADA: 'text-purple-600'
    }
    return colores[estado] || 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/logo_dorado_sin_nombre.png" 
              alt="Jaguar Logo" 
              className="h-12 w-12"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Seguimiento de Pedido
            </h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Ingresa tu código de seguimiento para ver el estado de tu pedido
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <Card className="mb-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="codigo" value="Código de Seguimiento" />
              <div className="flex gap-2 mt-1">
                <TextInput
                  id="codigo"
                  type="text"
                  placeholder="Ej: PED-2024-001"
                  value={codigoSeguimiento}
                  onChange={(e) => setCodigoSeguimiento(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && buscarPedido()}
                />
                <Button
                  onClick={buscarPedido}
                  disabled={loading}
                  className="bg-primary-400 hover:bg-primary-500 text-gray-900"
                >
                  <HiSearch className="mr-2 h-4 w-4" />
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>El código de seguimiento te fue proporcionado al crear tu pedido.</p>
              <p>Ejemplo de códigos: PED-2024-001, PED-2024-002, PED-2024-003</p>
            </div>
          </div>
        </Card>

        {/* Resultado de la búsqueda */}
        {searched && (
          <Card>
            {proforma ? (
              <div className="space-y-6">
                {/* Información del pedido */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Pedido #{proforma.codigo_seguimiento}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Cliente: {proforma.cliente_nombre}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Creado: {formatDateTime(proforma.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusPill status={proforma.estado} />
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                        {formatCurrency(proforma.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estado del pedido */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Estado Actual
                  </h3>
                  <p className={`${getEstadoColor(proforma.estado)} font-medium`}>
                    {getEstadoDescripcion(proforma.estado)}
                  </p>
                  
                  {proforma.fecha_expiracion && proforma.estado === 'RESERVA' && (
                    <p className="text-sm text-yellow-600 mt-2">
                      ⏰ Tiempo límite para pagar: {formatDateTime(proforma.fecha_expiracion)}
                    </p>
                  )}
                </div>

                {/* Línea de tiempo del pedido */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Progreso del Pedido
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900 dark:text-white">Pedido Creado</p>
                        <p className="text-sm text-gray-500">{formatDateTime(proforma.created_at)}</p>
                      </div>
                    </div>

                    {proforma.estado !== 'EMITIDA' && (
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          ['RESERVA', 'PAGADA', 'DESPACHADA'].includes(proforma.estado) 
                            ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          <span className="text-white text-sm font-bold">
                            {['RESERVA', 'PAGADA', 'DESPACHADA'].includes(proforma.estado) ? '✓' : '2'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900 dark:text-white">Reservado</p>
                          <p className="text-sm text-gray-500">Pedido confirmado y reservado</p>
                        </div>
                      </div>
                    )}

                    {['PAGADA', 'DESPACHADA'].includes(proforma.estado) && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900 dark:text-white">Pago Confirmado</p>
                          <p className="text-sm text-gray-500">El pago ha sido procesado exitosamente</p>
                        </div>
                      </div>
                    )}

                    {proforma.estado === 'DESPACHADA' && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900 dark:text-white">Despachado</p>
                          <p className="text-sm text-gray-500">Tu pedido está en camino</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalles del pedido */}
                {proforma.lineas && proforma.lineas.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Productos Pedidos
                    </h3>
                    <div className="space-y-3">
                      {proforma.lineas.map((linea, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {linea.saco?.tipo?.replace('_', ' ')} - {linea.saco?.temporada}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {linea.saco?.id} | Precio: {formatCurrency(linea.precio_unitario)}
                            </p>
                            {linea.descuento_linea > 0 && (
                              <p className="text-sm text-green-600">
                                Descuento: {linea.descuento_linea}%
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(linea.subtotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Información de contacto */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    ¿Necesitas ayuda?
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Si tienes alguna pregunta sobre tu pedido, contáctanos:
                  </p>
                  <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                    <p>📞 Teléfono: +51 999 888 777</p>
                    <p>📧 Email: soporte@tienda.com</p>
                    <p>💬 WhatsApp: +51 999 888 777</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <HiSearch className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Pedido no encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  No se encontró ningún pedido con el código ingresado.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Verifica que el código esté escrito correctamente.
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}