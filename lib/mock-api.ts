import { 
  mockUsers, 
  mockProveedores, 
  mockPedidos, 
  mockSacos, 
  mockListas, 
  mockProformas, 
  mockPagos, 
  mockKPIs, 
  mockDeudaProveedores,
  createPaginatedResponse,
  simulateNetworkDelay,
  generateUniqueQR
} from './mock-data'
import { 
  LoginRequest, 
  LoginResponse, 
  User,
  Pedido,
  Saco,
  Lista,
  Proforma,
  Pago,
  Proveedor,
  KPIData,
  DeudaProveedor,
  CreatePedidoRequest,
  CreateSacoRequest,
  CreateListaRequest,
  CreateProformaRequest,
  CreatePagoRequest,
  PaginatedResponse,
  SacoEstado,
  ProformaEstado,
  Categoria,
  SacoTipo,
  Temporada
} from '@/types'

// Flag para habilitar/deshabilitar modo mock
const USE_MOCK_API = process.env.NODE_ENV === 'development'

// Storage simulado en memoria
let currentUser: User | null = null
let sacosStorage = [...mockSacos]
let pedidosStorage = [...mockPedidos]
let listasStorage = [...mockListas]
let proformasStorage = [...mockProformas]
let pagosStorage = [...mockPagos]

// Auth API Mock
export const mockAuthAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await simulateNetworkDelay(800)
    
    // Validar credenciales mock
    const user = mockUsers.find(u => 
      u.username === credentials.username && 
      (credentials.password === 'admin123' || credentials.password === u.username + '123')
    )
    
    if (!user) {
      throw new Error('Credenciales inválidas')
    }
    
    currentUser = user
    
    return {
      access_token: `mock-jwt-token-${user.id}`,
      token_type: 'Bearer',
      user
    }
  },

  me: async (): Promise<User> => {
    await simulateNetworkDelay(200)
    
    if (!currentUser) {
      throw new Error('No autenticado')
    }
    
    return currentUser
  }
}

// Proveedores API Mock
export const mockProveedoresAPI = {
  getAll: async (): Promise<Proveedor[]> => {
    await simulateNetworkDelay(300)
    return mockProveedores
  },

  create: async (data: Omit<Proveedor, 'id'>): Promise<Proveedor> => {
    await simulateNetworkDelay(500)
    const newProveedor: Proveedor = {
      ...data,
      id: Math.max(...mockProveedores.map(p => p.id)) + 1
    }
    return newProveedor
  }
}

// Pedidos API Mock
export const mockPedidosAPI = {
  getAll: async (page = 1, size = 20): Promise<PaginatedResponse<Pedido>> => {
    await simulateNetworkDelay(400)
    return createPaginatedResponse(pedidosStorage, page, size)
  },

  getById: async (id: number): Promise<Pedido> => {
    await simulateNetworkDelay(200)
    const pedido = pedidosStorage.find(p => p.id === id)
    if (!pedido) throw new Error('Pedido no encontrado')
    return pedido
  },

  create: async (data: CreatePedidoRequest): Promise<Pedido> => {
    await simulateNetworkDelay(600)
    const proveedor = mockProveedores.find(p => p.id === data.proveedor_id)
    const newPedido: Pedido = {
      id: Math.max(...pedidosStorage.map(p => p.id)) + 1,
      ...data,
      proveedor,
      fecha_pedido: new Date().toISOString(),
      estado: 'CREADO' as any,
      total_sacos: 0,
      created_at: new Date().toISOString()
    }
    pedidosStorage.push(newPedido)
    return newPedido
  },

  updateEstado: async (id: number, estado: string): Promise<Pedido> => {
    await simulateNetworkDelay(300)
    const pedidoIndex = pedidosStorage.findIndex(p => p.id === id)
    if (pedidoIndex === -1) throw new Error('Pedido no encontrado')
    
    pedidosStorage[pedidoIndex] = {
      ...pedidosStorage[pedidoIndex],
      estado: estado as any
    }
    return pedidosStorage[pedidoIndex]
  }
}

// Sacos API Mock
export const mockSacosAPI = {
  getAll: async (page = 1, size = 20, filters?: Record<string, string>): Promise<PaginatedResponse<Saco>> => {
    await simulateNetworkDelay(400)
    
    let filteredSacos = [...sacosStorage]
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filteredSacos = filteredSacos.filter(saco => 
            String(saco[key as keyof Saco]) === value
          )
        }
      })
    }
    
    return createPaginatedResponse(filteredSacos, page, size)
  },

  getById: async (id: number): Promise<Saco> => {
    await simulateNetworkDelay(200)
    const saco = sacosStorage.find(s => s.id === id)
    if (!saco) throw new Error('Prenda no encontrada')
    return saco
  },

  create: async (data: CreateSacoRequest): Promise<Saco> => {
    await simulateNetworkDelay(600)
    const pedido = data.pedido_id ? pedidosStorage.find(p => p.id === data.pedido_id) : undefined
    const newSaco: Saco = {
      id: Math.max(...sacosStorage.map(s => s.id)) + 1,
      ...data,
      pedido,
      estado: SacoEstado.RECIBIDO,
      qr_code: generateUniqueQR(),
      created_at: new Date().toISOString()
    }
    sacosStorage.push(newSaco)
    return newSaco
  },

  update: async (id: number, data: Partial<Saco>): Promise<Saco> => {
    await simulateNetworkDelay(400)
    const sacoIndex = sacosStorage.findIndex(s => s.id === id)
    if (sacoIndex === -1) throw new Error('Prenda no encontrada')
    
    sacosStorage[sacoIndex] = {
      ...sacosStorage[sacoIndex],
      ...data
    }
    return sacosStorage[sacoIndex]
  },

  updateEstado: async (id: number, estado: string): Promise<Saco> => {
    await simulateNetworkDelay(300)
    const sacoIndex = sacosStorage.findIndex(s => s.id === id)
    if (sacoIndex === -1) throw new Error('Prenda no encontrada')
    
    sacosStorage[sacoIndex] = {
      ...sacosStorage[sacoIndex],
      estado: estado as SacoEstado
    }
    return sacosStorage[sacoIndex]
  }
}

// Listas API Mock
export const mockListasAPI = {
  getAll: async (): Promise<Lista[]> => {
    await simulateNetworkDelay(300)
    return listasStorage
  },

  getById: async (id: number): Promise<Lista> => {
    await simulateNetworkDelay(200)
    const lista = listasStorage.find(l => l.id === id)
    if (!lista) throw new Error('Lista no encontrada')
    return lista
  },

  getByEnlace: async (enlace: string): Promise<Lista> => {
    await simulateNetworkDelay(400)
    const lista = listasStorage.find(l => l.enlace_publico === enlace)
    if (!lista) throw new Error('Lista no encontrada')
    return lista
  },

  create: async (data: CreateListaRequest): Promise<Lista> => {
    await simulateNetworkDelay(500)
    const newLista: Lista = {
      id: Math.max(...listasStorage.map(l => l.id)) + 1,
      ...data,
      activa: false,
      created_at: new Date().toISOString(),
      sacos: []
    }
    listasStorage.push(newLista)
    return newLista
  },

  addSaco: async (listaId: number, sacoId: number): Promise<void> => {
    await simulateNetworkDelay(300)
    const listaIndex = listasStorage.findIndex(l => l.id === listaId)
    const saco = sacosStorage.find(s => s.id === sacoId)
    
    if (listaIndex === -1) throw new Error('Lista no encontrada')
    if (!saco) throw new Error('Prenda no encontrada')
    
    if (!listasStorage[listaIndex].sacos) {
      listasStorage[listaIndex].sacos = []
    }
    
    const sacoExists = listasStorage[listaIndex].sacos!.some(s => s.id === sacoId)
    if (!sacoExists) {
      listasStorage[listaIndex].sacos!.push(saco)
    }
  },

  removeSaco: async (listaId: number, sacoId: number): Promise<void> => {
    await simulateNetworkDelay(300)
    const listaIndex = listasStorage.findIndex(l => l.id === listaId)
    
    if (listaIndex === -1) throw new Error('Lista no encontrada')
    
    if (listasStorage[listaIndex].sacos) {
      listasStorage[listaIndex].sacos = listasStorage[listaIndex].sacos!.filter(s => s.id !== sacoId)
    }
  },

  activate: async (id: number): Promise<Lista> => {
    await simulateNetworkDelay(300)
    const listaIndex = listasStorage.findIndex(l => l.id === id)
    if (listaIndex === -1) throw new Error('Lista no encontrada')
    
    listasStorage[listaIndex] = {
      ...listasStorage[listaIndex],
      activa: true
    }
    return listasStorage[listaIndex]
  },

  generateEnlace: async (id: number): Promise<Lista> => {
    await simulateNetworkDelay(400)
    const listaIndex = listasStorage.findIndex(l => l.id === id)
    if (listaIndex === -1) throw new Error('Lista no encontrada')
    
    const enlace = `lista-${id}-${Date.now()}`
    listasStorage[listaIndex] = {
      ...listasStorage[listaIndex],
      enlace_publico: enlace
    }
    return listasStorage[listaIndex]
  }
}

// Proformas API Mock
export const mockProformasAPI = {
  getAll: async (page = 1, size = 20): Promise<PaginatedResponse<Proforma>> => {
    await simulateNetworkDelay(400)
    return createPaginatedResponse(proformasStorage, page, size)
  },

  getById: async (id: number): Promise<Proforma> => {
    await simulateNetworkDelay(200)
    const proforma = proformasStorage.find(p => p.id === id)
    if (!proforma) throw new Error('Proforma no encontrada')
    return proforma
  },

  create: async (data: CreateProformaRequest): Promise<Proforma> => {
    await simulateNetworkDelay(700)
    const lista = data.lista_id ? listasStorage.find(l => l.id === data.lista_id) : undefined
    
    const lineas = data.lineas.map((linea, index) => {
      const saco = sacosStorage.find(s => s.id === linea.saco_id)
      const subtotalSinDescuento = linea.precio_unitario
      const descuentoLinea = (subtotalSinDescuento * (linea.descuento_linea || 0)) / 100
      const subtotal = subtotalSinDescuento - descuentoLinea
      
      return {
        id: index + 1,
        proforma_id: 0, // Se asignará después
        saco_id: linea.saco_id,
        saco,
        precio_unitario: linea.precio_unitario,
        descuento_linea: linea.descuento_linea || 0,
        subtotal
      }
    })
    
    const subtotalTotal = lineas.reduce((sum, linea) => sum + linea.subtotal, 0)
    const descuentoGlobal = (subtotalTotal * (data.descuento_global || 0)) / 100
    const total = subtotalTotal - descuentoGlobal
    
    const newId = Math.max(...proformasStorage.map(p => p.id)) + 1
    const codigoSeguimiento = `PF${newId.toString().padStart(6, '0')}-${Date.now().toString().slice(-4)}`
    
    const newProforma: Proforma = {
      id: newId,
      lista_id: data.lista_id,
      lista,
      cliente_nombre: data.cliente_nombre,
      cliente_telefono: data.cliente_telefono,
      cliente_email: data.cliente_email,
      estado: ProformaEstado.EMITIDA,
      descuento_global: data.descuento_global || 0,
      total,
      codigo_seguimiento: codigoSeguimiento,
      created_at: new Date().toISOString(),
      lineas: lineas.map(linea => ({ ...linea, proforma_id: newId }))
    }
    
    proformasStorage.push(newProforma)
    return newProforma
  },

  emitir: async (id: number): Promise<Proforma> => {
    await simulateNetworkDelay(400)
    const proformaIndex = proformasStorage.findIndex(p => p.id === id)
    if (proformaIndex === -1) throw new Error('Proforma no encontrada')
    
    const fechaExpiracion = new Date()
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 7) // 7 días para pagar
    
    proformasStorage[proformaIndex] = {
      ...proformasStorage[proformaIndex],
      estado: ProformaEstado.RESERVA,
      fecha_expiracion: fechaExpiracion.toISOString()
    }
    return proformasStorage[proformaIndex]
  },

  getByCodigo: async (codigo: string): Promise<Proforma> => {
    await simulateNetworkDelay(300)
    const proforma = proformasStorage.find(p => p.codigo_seguimiento === codigo)
    if (!proforma) throw new Error('Proforma no encontrada')
    return proforma
  }
}

// Pagos API Mock
export const mockPagosAPI = {
  getByProforma: async (proformaId: number): Promise<Pago[]> => {
    await simulateNetworkDelay(300)
    return pagosStorage.filter(p => p.proforma_id === proformaId)
  },

  create: async (data: CreatePagoRequest): Promise<Pago> => {
    await simulateNetworkDelay(600)
    const proforma = proformasStorage.find(p => p.id === data.proforma_id)
    
    const newPago: Pago = {
      id: Math.max(...pagosStorage.map(p => p.id)) + 1,
      proforma_id: data.proforma_id,
      proforma,
      monto: data.monto,
      metodo_pago: data.metodo_pago,
      voucher_url: data.voucher ? 'https://example.com/voucher-mock.jpg' : undefined,
      observaciones: data.observaciones,
      created_at: new Date().toISOString()
    }
    
    pagosStorage.push(newPago)
    
    // Actualizar estado de proforma automáticamente según pagos
    if (proforma) {
      const totalPagado = pagosStorage
        .filter(p => p.proforma_id === data.proforma_id)
        .reduce((sum, p) => sum + p.monto, 0) + data.monto
      
      const proformaIndex = proformasStorage.findIndex(p => p.id === data.proforma_id)
      if (proformaIndex !== -1) {
        let nuevoEstado = proformasStorage[proformaIndex].estado
        
        if (totalPagado >= proforma.total) {
          nuevoEstado = ProformaEstado.PAGADA
        } else if (totalPagado > 0) {
          nuevoEstado = ProformaEstado.RESERVA
        }
        
        proformasStorage[proformaIndex] = {
          ...proformasStorage[proformaIndex],
          estado: nuevoEstado
        }
      }
    }
    
    return newPago
  }
}

// KPIs API Mock
export const mockKpisAPI = {
  getDashboard: async (): Promise<KPIData> => {
    await simulateNetworkDelay(500)
    return mockKPIs
  },

  getDeudaProveedores: async (): Promise<DeudaProveedor[]> => {
    await simulateNetworkDelay(400)
    return mockDeudaProveedores
  }
}

// Función para determinar si usar mock o API real
export const shouldUseMockAPI = () => USE_MOCK_API

// Exportar todas las APIs mock
export const mockAPI = {
  auth: mockAuthAPI,
  proveedores: mockProveedoresAPI,
  pedidos: mockPedidosAPI,
  sacos: mockSacosAPI,
  listas: mockListasAPI,
  proformas: mockProformasAPI,
  pagos: mockPagosAPI,
  kpis: mockKpisAPI
}