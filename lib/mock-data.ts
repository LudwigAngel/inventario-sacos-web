import { 
  User, 
  UserRole, 
  Pedido, 
  PedidoEstado, 
  Saco, 
  SacoEstado, 
  SacoTipo, 
  Temporada,
  Categoria,
  Lista,
  ListaTipo,
  Proforma,
  ProformaEstado,
  ProformaLinea,
  Pago,
  Proveedor,
  KPIData,
  DeudaProveedor,
  PaginatedResponse
} from '@/types'

// Usuarios mock
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    nombre: 'Administrador',
    rol: UserRole.ADMIN,
    activo: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'compras',
    nombre: 'Juan Pérez',
    rol: UserRole.COMPRAS,
    activo: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    username: 'almacen',
    nombre: 'María García',
    rol: UserRole.ALMACEN,
    activo: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    username: 'vendedor',
    nombre: 'Carlos López',
    rol: UserRole.VENDEDOR,
    activo: true,
    created_at: '2024-01-01T00:00:00Z'
  }
]

// Proveedores mock
export const mockProveedores: Proveedor[] = [
  {
    id: 1,
    nombre: 'Textiles Fashion SAC',
    contacto: 'José Martínez',
    telefono: '987654321',
    activo: true
  },
  {
    id: 2,
    nombre: 'Confecciones del Norte',
    contacto: 'Ana Rodríguez',
    telefono: '987654322',
    activo: true
  },
  {
    id: 3,
    nombre: 'Moda Peruana EIRL',
    contacto: 'Luis Fernández',
    telefono: '987654323',
    activo: true
  }
]

// Pedidos mock
export const mockPedidos: Pedido[] = [
  {
    id: 1,
    proveedor_id: 1,
    proveedor: mockProveedores[0],
    fecha_pedido: '2024-01-15T10:00:00Z',
    fecha_entrega_estimada: '2024-01-20T00:00:00Z',
    estado: PedidoEstado.RECIBIDO,
    observaciones: 'Pedido de ropa para temporada de verano',
    total_sacos: 50,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    proveedor_id: 2,
    proveedor: mockProveedores[1],
    fecha_pedido: '2024-01-16T14:30:00Z',
    fecha_entrega_estimada: '2024-01-22T00:00:00Z',
    estado: PedidoEstado.EN_TRANSITO,
    observaciones: 'Colección de invierno para niños',
    total_sacos: 30,
    created_at: '2024-01-16T14:30:00Z'
  },
  {
    id: 3,
    proveedor_id: 3,
    proveedor: mockProveedores[2],
    fecha_pedido: '2024-01-17T09:15:00Z',
    estado: PedidoEstado.CREADO,
    observaciones: 'Ropa casual para adultos',
    total_sacos: 25,
    created_at: '2024-01-17T09:15:00Z'
  }
]

// Sacos mock (Conjuntos de ropa)
export const mockSacos: Saco[] = [
  // Sacos disponibles
  {
    id: 1,
    pedido_id: 1,
    pedido: mockPedidos[0],
    tipo: SacoTipo.CASUAL_HOMBRE,
    temporada: Temporada.VERANO,
    categoria: Categoria.HOMBRE,
    tallas_incluidas: ['M', 'L', 'XL'],
    descripcion_contenido: 'Saco de polos y shorts casuales',
    precio_base: 500.00,
    estado: SacoEstado.DISPONIBLE,
    qr_code: 'SACO-000001',
    observaciones: 'Conjunto casual de verano para hombre',
    created_at: '2024-01-20T08:00:00Z'
  },
  {
    id: 2,
    pedido_id: 1,
    tipo: SacoTipo.CASUAL_MUJER,
    temporada: Temporada.VERANO,
    categoria: Categoria.MUJER,
    tallas_incluidas: ['S', 'M', 'L'],
    descripcion_contenido: 'Saco de blusas y faldas casuales',
    precio_base: 500.00,
    estado: SacoEstado.DISPONIBLE,
    qr_code: 'SACO-000002',
    observaciones: 'Conjunto casual de verano para mujer',
    created_at: '2024-01-20T08:05:00Z'
  },
  {
    id: 3,
    pedido_id: 1,
    tipo: SacoTipo.INFANTIL_NINO,
    temporada: Temporada.VERANO,
    categoria: Categoria.NINO,
    tallas_incluidas: ['6', '8', '10'],
    descripcion_contenido: 'Saco de polos y shorts deportivos',
    precio_base: 500.00,
    estado: SacoEstado.DISPONIBLE,
    qr_code: 'SACO-000003',
    observaciones: 'Conjunto deportivo para niño',
    created_at: '2024-01-20T08:10:00Z'
  },
  {
    id: 4,
    tipo: SacoTipo.FORMAL_HOMBRE,
    temporada: Temporada.INVIERNO,
    categoria: Categoria.HOMBRE,
    tallas_incluidas: ['M', 'L', 'XL'],
    descripcion_contenido: 'Saco de camisas y pantalones formales',
    precio_base: 500.00,
    estado: SacoEstado.DISPONIBLE,
    qr_code: 'SACO-000004',
    observaciones: 'Conjunto formal para hombre',
    created_at: '2024-01-21T10:00:00Z'
  },
  {
    id: 5,
    tipo: SacoTipo.INFANTIL_NINA,
    temporada: Temporada.VERANO,
    categoria: Categoria.NINA,
    tallas_incluidas: ['8', '10', '12'],
    descripcion_contenido: 'Saco de vestidos y blusas',
    precio_base: 500.00,
    estado: SacoEstado.DISPONIBLE,
    qr_code: 'SACO-000005',
    observaciones: 'Conjunto de verano para niña',
    created_at: '2024-01-21T11:00:00Z'
  },
  {
    id: 6,
    tipo: SacoTipo.DEPORTIVO_MUJER,
    temporada: Temporada.INVIERNO,
    categoria: Categoria.MUJER,
    tallas_incluidas: ['S', 'M', 'L'],
    descripcion_contenido: 'Saco de tops y leggins deportivos',
    precio_base: 500.00,
    estado: SacoEstado.RESERVADO,
    qr_code: 'SACO-000006',
    observaciones: 'Conjunto deportivo de invierno',
    created_at: '2024-01-21T12:00:00Z'
  },
  {
    id: 7,
    tipo: SacoTipo.FORMAL_MUJER,
    temporada: Temporada.OTONO,
    categoria: Categoria.MUJER,
    tallas_incluidas: ['S', 'M', 'L'],
    descripcion_contenido: 'Saco de blusas y blazers formales',
    precio_base: 500.00,
    estado: SacoEstado.DISPONIBLE,
    qr_code: 'SACO-000007',
    observaciones: 'Conjunto formal para mujer',
    created_at: '2024-01-21T13:00:00Z'
  },
  {
    id: 8,
    tipo: SacoTipo.DEPORTIVO_HOMBRE,
    temporada: Temporada.OTONO,
    categoria: Categoria.HOMBRE,
    tallas_incluidas: ['M', 'L', 'XL'],
    descripcion_contenido: 'Saco de polos y buzos deportivos',
    precio_base: 500.00,
    estado: SacoEstado.DISPONIBLE,
    qr_code: 'SACO-000008',
    observaciones: 'Conjunto deportivo de otoño',
    created_at: '2024-01-21T14:00:00Z'
  },
  // Sacos recibidos (para etiquetado)
  {
    id: 9,
    pedido_id: 2,
    tipo: SacoTipo.CASUAL_MUJER,
    temporada: Temporada.INVIERNO,
    categoria: Categoria.MUJER,
    tallas_incluidas: ['S', 'M'],
    descripcion_contenido: 'Saco de sweaters y jeans',
    precio_base: 500.00,
    estado: SacoEstado.RECIBIDO,
    qr_code: 'SACO-000009',
    observaciones: 'Conjunto casual de invierno',
    created_at: '2024-01-22T09:00:00Z'
  },
  {
    id: 10,
    pedido_id: 2,
    tipo: SacoTipo.CASUAL_HOMBRE,
    temporada: Temporada.INVIERNO,
    categoria: Categoria.HOMBRE,
    tallas_incluidas: ['L', 'XL'],
    descripcion_contenido: 'Saco de polos y casacas',
    precio_base: 500.00,
    estado: SacoEstado.RECIBIDO,
    qr_code: 'SACO-000010',
    observaciones: 'Conjunto casual de invierno',
    created_at: '2024-01-22T09:05:00Z'
  }
]

// Listas mock
export const mockListas: Lista[] = [
  {
    id: 1,
    nombre: 'Colección VIP Verano 2024',
    tipo: ListaTipo.VIP,
    activa: true,
    enlace_publico: 'vip-verano-2024',
    created_at: '2024-01-10T00:00:00Z',
    sacos: [mockSacos[0], mockSacos[1], mockSacos[3], mockSacos[4]]
  },
  {
    id: 2,
    nombre: 'Catálogo BASE Infantil',
    tipo: ListaTipo.BASE,
    activa: true,
    enlace_publico: 'base-infantil-2024',
    created_at: '2024-01-12T00:00:00Z',
    sacos: [mockSacos[2], mockSacos[7]]
  },
  {
    id: 3,
    nombre: 'Colección VIP Invierno 2024',
    tipo: ListaTipo.VIP,
    activa: false,
    created_at: '2024-01-25T00:00:00Z',
    sacos: [mockSacos[5], mockSacos[6]]
  }
]

// Proformas mock
export const mockProformaLineas: ProformaLinea[] = [
  {
    id: 1,
    proforma_id: 1,
    saco_id: 1,
    saco: mockSacos[0],
    precio_unitario: 500.00,
    descuento_linea: 0,
    subtotal: 500.00
  },
  {
    id: 2,
    proforma_id: 1,
    saco_id: 4,
    saco: mockSacos[3],
    precio_unitario: 500.00,
    descuento_linea: 10,
    subtotal: 450.00
  },
  {
    id: 3,
    proforma_id: 2,
    saco_id: 2,
    saco: mockSacos[1],
    precio_unitario: 500.00,
    descuento_linea: 0,
    subtotal: 500.00
  },
  {
    id: 4,
    proforma_id: 3,
    saco_id: 5,
    saco: mockSacos[4],
    precio_unitario: 500.00,
    descuento_linea: 0,
    subtotal: 500.00
  }
]

export const mockProformas: Proforma[] = [
  {
    id: 1,
    codigo_seguimiento: 'PED-2024-001',
    lista_id: 1,
    lista: mockListas[0],
    cliente_nombre: 'Boutique Elegancia',
    cliente_telefono: '987123456',
    cliente_email: 'compras@elegancia.com',
    estado: ProformaEstado.PAGADA,
    descuento_global: 5,
    descuento_manual: 47.50,
    total_original: 1000.00,
    total: 902.50,
    created_at: '2024-01-23T14:30:00Z',
    lineas: [mockProformaLineas[0], mockProformaLineas[1]]
  },
  {
    id: 2,
    codigo_seguimiento: 'PED-2024-002',
    lista_id: 1,
    cliente_nombre: 'María Gonzales',
    cliente_telefono: '987654321',
    estado: ProformaEstado.RESERVA,
    descuento_global: 0,
    total_original: 500.00,
    fecha_expiracion: '2024-01-30T23:59:59Z',
    total: 500.00,
    created_at: '2024-01-24T10:15:00Z',
    lineas: [mockProformaLineas[2]]
  },
  {
    id: 3,
    codigo_seguimiento: 'PED-2024-003',
    cliente_nombre: 'Carlos Mendoza',
    cliente_telefono: '987111222',
    cliente_email: 'carlos.mendoza@email.com',
    estado: ProformaEstado.EMITIDA,
    descuento_global: 0,
    total_original: 500.00,
    total: 500.00,
    created_at: '2024-01-25T16:45:00Z',
    lineas: [mockProformaLineas[3]]
  },
  {
    id: 4,
    codigo_seguimiento: 'PED-2024-004',
    cliente_nombre: 'Ana Torres',
    cliente_telefono: '987333444',
    estado: ProformaEstado.VENCIDA,
    descuento_global: 0,
    total_original: 1000.00,
    fecha_expiracion: '2024-01-20T23:59:59Z',
    total: 1000.00,
    created_at: '2024-01-18T12:00:00Z',
    lineas: []
  }
]

// Pagos mock
export const mockPagos: Pago[] = [
  {
    id: 1,
    proforma_id: 1,
    proforma: mockProformas[0],
    monto: 902.50,
    metodo_pago: 'TRANSFERENCIA',
    voucher_url: 'https://example.com/voucher1.jpg',
    observaciones: 'Pago completo por transferencia',
    created_at: '2024-01-23T15:00:00Z'
  },
  {
    id: 2,
    proforma_id: 2,
    proforma: mockProformas[1],
    monto: 250.00,
    metodo_pago: 'EFECTIVO',
    observaciones: 'Pago parcial en efectivo',
    created_at: '2024-01-24T11:00:00Z'
  }
]

// KPIs mock
export const mockKPIs: KPIData = {
  stock_disponible: 8,
  reservas_por_vencer: 1,
  ventas_del_dia: 1402.50,
  deuda_proveedor: 25750.00
}

// Deuda proveedores mock
export const mockDeudaProveedores: DeudaProveedor[] = [
  {
    proveedor_id: 1,
    proveedor_nombre: 'Textiles Fashion SAC',
    total_deuda: 18500.00,
    pedidos_pendientes: 2
  },
  {
    proveedor_id: 2,
    proveedor_nombre: 'Confecciones del Norte',
    total_deuda: 7250.00,
    pedidos_pendientes: 1
  },
  {
    proveedor_id: 3,
    proveedor_nombre: 'Moda Peruana EIRL',
    total_deuda: 0,
    pedidos_pendientes: 0
  }
]

// Función helper para crear respuestas paginadas
export function createPaginatedResponse<T>(
  items: T[], 
  page = 1, 
  size = 20
): PaginatedResponse<T> {
  const startIndex = (page - 1) * size
  const endIndex = startIndex + size
  const paginatedItems = items.slice(startIndex, endIndex)
  
  return {
    items: paginatedItems,
    total: items.length,
    page,
    size,
    pages: Math.ceil(items.length / size)
  }
}

// Función para simular delay de red
export const simulateNetworkDelay = (ms = 500) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Función para generar QR único
export const generateUniqueQR = () => {
  const nextId = Math.max(...mockSacos.map(s => s.id), 0) + 1
  return `PRENDA-${nextId.toString().padStart(6, '0')}`
}