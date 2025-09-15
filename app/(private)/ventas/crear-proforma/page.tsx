'use client'

import { useState } from 'react'
import { Button, Card, Label, TextInput, Textarea, Select } from 'flowbite-react'
import { HiPlus, HiMinus, HiSearch, HiQrcode } from 'react-icons/hi'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SacoCard } from '@/components/ui/SacoCard'
import { MoneyInput } from '@/components/ui/MoneyInput'
import { PdfButton, PngButton } from '@/components/ui/ExportButtons'
import { AuthGuard } from '@/lib/auth-guard'
import { sacosAPI, proformasAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { UserRole, type Saco, SacoEstado } from '@/types'
import { toast } from 'react-hot-toast'

const proformaSchema = z.object({
    cliente_nombre: z.string().min(1, 'El nombre del cliente es requerido'),
    cliente_telefono: z.string().optional(),
    cliente_email: z.string().email('Email inválido').optional().or(z.literal('')),
    descuento_global: z.number().min(0).max(100).default(0),
    lineas: z.array(z.object({
        saco_id: z.number(),
        precio_unitario: z.number().min(0.01),
        descuento_linea: z.number().min(0).max(100).default(0)
    })).min(1, 'Debe agregar al menos un producto')
})

type ProformaForm = z.infer<typeof proformaSchema>

export default function CrearProformaPage() {
    const [buscarSaco, setBuscarSaco] = useState('')
    const [sacoSeleccionado, setSacoSeleccionado] = useState<Saco | null>(null)
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false)

    const { data: sacosDisponibles } = useSWR('/sacos-disponibles', () =>
        sacosAPI.getAll(1, 50, { estado: SacoEstado.DISPONIBLE })
    )

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<ProformaForm>({
        resolver: zodResolver(proformaSchema),
        defaultValues: {
            descuento_global: 0,
            lineas: []
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'lineas'
    })

    const watchedLineas = watch('lineas')
    const descuentoGlobal = watch('descuento_global')

    const buscarSacoPorId = () => {
        if (!buscarSaco.trim()) {
            toast.error('Ingresa un ID o código QR')
            return
        }

        const saco = sacosDisponibles?.items.find(s =>
            s.id.toString() === buscarSaco.trim() ||
            s.qr_code === buscarSaco.trim()
        )

        if (saco) {
            setSacoSeleccionado(saco)
            toast.success('Saco encontrado')
        } else {
            setSacoSeleccionado(null)
            toast.error('Saco no encontrado o no disponible')
        }
    }

    const agregarSaco = () => {
        if (!sacoSeleccionado) return

        // Verificar si ya está agregado
        const yaExiste = fields.some(field => field.saco_id === sacoSeleccionado.id)
        if (yaExiste) {
            toast.error('Este saco ya está en la proforma')
            return
        }

        append({
            saco_id: sacoSeleccionado.id,
            precio_unitario: sacoSeleccionado.precio_base,
            descuento_linea: 0
        })

        setSacoSeleccionado(null)
        setBuscarSaco('')
        toast.success('Saco agregado a la proforma')
    }

    const calcularSubtotal = (index: number) => {
        const linea = watchedLineas[index]
        if (!linea) return 0

        const subtotalSinDescuento = linea.precio_unitario
        const descuentoLinea = (subtotalSinDescuento * linea.descuento_linea) / 100
        return subtotalSinDescuento - descuentoLinea
    }

    const calcularTotal = () => {
        const subtotal = watchedLineas.reduce((sum, _, index) => sum + calcularSubtotal(index), 0)
        const descuentoGlobalMonto = (subtotal * descuentoGlobal) / 100
        return subtotal - descuentoGlobalMonto
    }

    const onSubmit = async (data: ProformaForm) => {
        try {
            const proforma = await proformasAPI.create(data)
            toast.success(`Proforma #${proforma.codigo_seguimiento} creada exitosamente`)

            // Limpiar formulario
            setValue('cliente_nombre', '')
            setValue('cliente_telefono', '')
            setValue('cliente_email', '')
            setValue('descuento_global', 0)
            setValue('lineas', [])

        } catch (error) {
            toast.error('Error al crear la proforma')
        }
    }

    const getSacoInfo = (sacoId: number) => {
        return sacosDisponibles?.items.find(s => s.id === sacoId)
    }

    return (
        <AuthGuard requiredRoles={[UserRole.ADMIN, UserRole.VENDEDOR]}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <img 
                                    src="/logo_dorado_sin_nombre.png" 
                                    alt="Jaguar Logo" 
                                    className="h-10 w-10"
                                />
                                <h1 className="text-3xl font-bold text-jaguar-100">
                                    Crear Proforma Manual
                                </h1>
                            </div>
                            <p className="mt-2 text-coffee-300">
                                Genera proformas personalizadas con descuentos para clientes
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Panel de búsqueda de sacos */}
                        <div className="lg:col-span-1">
                            <Card className="jaguar-card">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-jaguar-200 mb-4 flex items-center">
                                        <HiSearch className="mr-2 h-5 w-5" />
                                        Buscar Productos
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="buscar" value="ID o Código QR" className="text-jaguar-300" />
                                            <div className="flex gap-2 mt-1">
                                                <TextInput
                                                    id="buscar"
                                                    type="text"
                                                    placeholder="Ej: 123 o SACO-000123"
                                                    value={buscarSaco}
                                                    onChange={(e) => setBuscarSaco(e.target.value)}
                                                    className="flex-1 jaguar-input"
                                                    onKeyPress={(e) => e.key === 'Enter' && buscarSacoPorId()}
                                                />
                                                <Button
                                                    onClick={buscarSacoPorId}
                                                    className="jaguar-button"
                                                >
                                                    <HiSearch className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
                                            color="gray"
                                            className="w-full"
                                        >
                                            {mostrarBusqueda ? 'Ocultar' : 'Ver'} Catálogo Completo
                                        </Button>

                                        {/* Saco encontrado */}
                                        {sacoSeleccionado && (
                                            <div className="border border-jaguar-600 rounded-lg p-3 bg-dark-800">
                                                <SacoCard saco={sacoSeleccionado} />
                                                <Button
                                                    onClick={agregarSaco}
                                                    className="w-full mt-3 jaguar-button"
                                                >
                                                    <HiPlus className="mr-2 h-4 w-4" />
                                                    Agregar a Proforma
                                                </Button>
                                            </div>
                                        )}

                                        {/* Catálogo completo */}
                                        {mostrarBusqueda && (
                                            <div className="max-h-96 overflow-y-auto space-y-2">
                                                {sacosDisponibles?.items.map(saco => (
                                                    <div
                                                        key={saco.id}
                                                        className="border border-coffee-600 rounded-lg p-2 cursor-pointer hover:bg-dark-700 transition-colors"
                                                        onClick={() => setSacoSeleccionado(saco)}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-sm font-medium text-jaguar-200">
                                                                    {saco.tipo.replace('_', ' ')}
                                                                </p>
                                                                <p className="text-xs text-coffee-300">
                                                                    ID: {saco.id} | {formatCurrency(saco.precio_base)}
                                                                </p>
                                                            </div>
                                                            <HiQrcode className="h-4 w-4 text-jaguar-400" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Formulario de proforma */}
                        <div className="lg:col-span-2">
                            <Card className="jaguar-card">
                                <div className="p-6">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Datos del cliente */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-jaguar-200 mb-4">
                                                Información del Cliente
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="cliente_nombre" value="Nombre Completo *" className="text-jaguar-300" />
                                                    <TextInput
                                                        id="cliente_nombre"
                                                        {...register('cliente_nombre')}
                                                        className="jaguar-input"
                                                        color={errors.cliente_nombre ? 'failure' : 'gray'}
                                                        helperText={errors.cliente_nombre?.message}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="cliente_telefono" value="Teléfono" className="text-jaguar-300" />
                                                    <TextInput
                                                        id="cliente_telefono"
                                                        {...register('cliente_telefono')}
                                                        className="jaguar-input"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="cliente_email" value="Email" className="text-jaguar-300" />
                                                    <TextInput
                                                        id="cliente_email"
                                                        type="email"
                                                        {...register('cliente_email')}
                                                        className="jaguar-input"
                                                        color={errors.cliente_email ? 'failure' : 'gray'}
                                                        helperText={errors.cliente_email?.message}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="descuento_global" value="Descuento Global (%)" className="text-jaguar-300" />
                                                    <TextInput
                                                        id="descuento_global"
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        {...register('descuento_global', { valueAsNumber: true })}
                                                        className="jaguar-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Productos agregados */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-jaguar-200 mb-4">
                                                Productos en la Proforma ({fields.length})
                                            </h3>

                                            {fields.length === 0 ? (
                                                <div className="text-center py-8 border-2 border-dashed border-coffee-600 rounded-lg">
                                                    <HiPlus className="mx-auto h-12 w-12 text-coffee-400" />
                                                    <p className="text-coffee-300 mt-2">
                                                        No hay productos agregados
                                                    </p>
                                                    <p className="text-sm text-coffee-400">
                                                        Busca y agrega productos usando el panel de la izquierda
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {fields.map((field, index) => {
                                                        const saco = getSacoInfo(field.saco_id)
                                                        return (
                                                            <div key={field.id} className="border border-coffee-600 rounded-lg p-4 bg-dark-800">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1">
                                                                        <h4 className="font-medium text-jaguar-200">
                                                                            {saco?.tipo.replace('_', ' ')} - {saco?.temporada}
                                                                        </h4>
                                                                        <p className="text-sm text-coffee-300">
                                                                            ID: {saco?.id} | Incluye: {saco?.tallas_incluidas?.join(', ')}
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-32">
                                                                            <Label value="Precio" className="text-xs text-jaguar-400" />
                                                                            <MoneyInput
                                                                                value={watchedLineas[index]?.precio_unitario || 0}
                                                                                onChange={(value) => setValue(`lineas.${index}.precio_unitario`, value)}
                                                                            />
                                                                        </div>

                                                                        <div className="w-24">
                                                                            <Label value="Desc. %" className="text-xs text-jaguar-400" />
                                                                            <TextInput
                                                                                type="number"
                                                                                min="0"
                                                                                max="100"
                                                                                step="0.01"
                                                                                {...register(`lineas.${index}.descuento_linea`, { valueAsNumber: true })}
                                                                                className="jaguar-input"
                                                                            />
                                                                        </div>

                                                                        <div className="w-32 text-right">
                                                                            <Label value="Subtotal" className="text-xs text-jaguar-400" />
                                                                            <p className="font-bold text-jaguar-200">
                                                                                {formatCurrency(calcularSubtotal(index))}
                                                                            </p>
                                                                        </div>

                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            color="failure"
                                                                            onClick={() => remove(index)}
                                                                        >
                                                                            <HiMinus className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Totales */}
                                        {fields.length > 0 && (
                                            <div className="border-t border-coffee-600 pt-4">
                                                <div className="flex justify-end">
                                                    <div className="w-64 space-y-2">
                                                        <div className="flex justify-between text-coffee-300">
                                                            <span>Subtotal:</span>
                                                            <span>{formatCurrency(watchedLineas.reduce((sum, _, index) => sum + calcularSubtotal(index), 0))}</span>
                                                        </div>
                                                        {descuentoGlobal > 0 && (
                                                            <div className="flex justify-between text-coffee-300">
                                                                <span>Descuento Global ({descuentoGlobal}%):</span>
                                                                <span>-{formatCurrency((watchedLineas.reduce((sum, _, index) => sum + calcularSubtotal(index), 0) * descuentoGlobal) / 100)}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between text-xl font-bold text-jaguar-200 border-t border-coffee-600 pt-2">
                                                            <span>Total:</span>
                                                            <span>{formatCurrency(calcularTotal())}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Botones de acción */}
                                        <div className="flex justify-end gap-4">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting || fields.length === 0}
                                                className="jaguar-button"
                                            >
                                                {isSubmitting ? 'Creando...' : 'Crear Proforma'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </AuthGuard>
    )
}