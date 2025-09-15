import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import { shouldUseMockAPI, mockAPI } from './mock-api'
import type {
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
  ApiResponse
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    const message = error.response?.data?.detail || error.message || 'Error desconocido'
    toast.error(message)
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (shouldUseMockAPI()) {
      return mockAPI.auth.login(credentials)
    }
    
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)
    
    const response = await api.post<LoginResponse>('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  me: async (): Promise<User> => {
    if (shouldUseMockAPI()) {
      return mockAPI.auth.me()
    }
    
    const response = await api.get<User>('/auth/me')
    return response.data
  }
}

// Proveedores API
export const proveedoresAPI = {
  getAll: async (): Promise<Proveedor[]> => {
    if (shouldUseMockAPI()) {
      return mockAPI.proveedores.getAll()
    }
    
    const response = await api.get<Proveedor[]>('/proveedores/')
    return response.data
  },

  create: async (data: Omit<Proveedor, 'id'>): Promise<Proveedor> => {
    if (shouldUseMockAPI()) {
      return mockAPI.proveedores.create(data)
    }
    
    const response = await api.post<Proveedor>('/proveedores/', data)
    return response.data
  }
}

// Pedidos API
export const pedidosAPI = {
  getAll: async (page = 1, size = 20): Promise<PaginatedResponse<Pedido>> => {
    if (shouldUseMockAPI()) {
      return mockAPI.pedidos.getAll(page, size)
    }
    
    const response = await api.get<PaginatedResponse<Pedido>>(`/pedidos/?page=${page}&size=${size}`)
    return response.data
  },

  getById: async (id: number): Promise<Pedido> => {
    if (shouldUseMockAPI()) {
      return mockAPI.pedidos.getById(id)
    }
    
    const response = await api.get<Pedido>(`/pedidos/${id}`)
    return response.data
  },

  create: async (data: CreatePedidoRequest): Promise<Pedido> => {
    if (shouldUseMockAPI()) {
      return mockAPI.pedidos.create(data)
    }
    
    const response = await api.post<Pedido>('/pedidos/', data)
    return response.data
  },

  updateEstado: async (id: number, estado: string): Promise<Pedido> => {
    if (shouldUseMockAPI()) {
      return mockAPI.pedidos.updateEstado(id, estado)
    }
    
    const response = await api.patch<Pedido>(`/pedidos/${id}/estado`, { estado })
    return response.data
  }
}

// Sacos API
export const sacosAPI = {
  getAll: async (page = 1, size = 20, filters?: Record<string, string>): Promise<PaginatedResponse<Saco>> => {
    if (shouldUseMockAPI()) {
      return mockAPI.sacos.getAll(page, size, filters)
    }
    
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() })
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })
    }
    const response = await api.get<PaginatedResponse<Saco>>(`/sacos/?${params}`)
    return response.data
  },

  getById: async (id: number): Promise<Saco> => {
    if (shouldUseMockAPI()) {
      return mockAPI.sacos.getById(id)
    }
    
    const response = await api.get<Saco>(`/sacos/${id}`)
    return response.data
  },

  create: async (data: CreateSacoRequest): Promise<Saco> => {
    if (shouldUseMockAPI()) {
      return mockAPI.sacos.create(data)
    }
    
    const response = await api.post<Saco>('/sacos/', data)
    return response.data
  },

  update: async (id: number, data: Partial<Saco>): Promise<Saco> => {
    if (shouldUseMockAPI()) {
      return mockAPI.sacos.update(id, data)
    }
    
    const response = await api.patch<Saco>(`/sacos/${id}`, data)
    return response.data
  },

  updateEstado: async (id: number, estado: string): Promise<Saco> => {
    if (shouldUseMockAPI()) {
      return mockAPI.sacos.updateEstado(id, estado)
    }
    
    const response = await api.patch<Saco>(`/sacos/${id}/estado`, { estado })
    return response.data
  }
}

// Listas API
export const listasAPI = {
  getAll: async (): Promise<Lista[]> => {
    if (shouldUseMockAPI()) {
      return mockAPI.listas.getAll()
    }
    
    const response = await api.get<Lista[]>('/listas/')
    return response.data
  },

  getById: async (id: number): Promise<Lista> => {
    if (shouldUseMockAPI()) {
      return mockAPI.listas.getById(id)
    }
    
    const response = await api.get<Lista>(`/listas/${id}`)
    return response.data
  },

  getByEnlace: async (enlace: string): Promise<Lista> => {
    if (shouldUseMockAPI()) {
      return mockAPI.listas.getByEnlace(enlace)
    }
    
    const response = await api.get<Lista>(`/listas/publico/${enlace}`)
    return response.data
  },

  create: async (data: CreateListaRequest): Promise<Lista> => {
    if (shouldUseMockAPI()) {
      return mockAPI.listas.create(data)
    }
    
    const response = await api.post<Lista>('/listas/', data)
    return response.data
  },

  addSaco: async (listaId: number, sacoId: number): Promise<void> => {
    if (shouldUseMockAPI()) {
      return mockAPI.listas.addSaco(listaId, sacoId)
    }
    
    await api.post(`/listas/${listaId}/sacos/${sacoId}`)
  },

  removeSaco: async (listaId: number, sacoId: number): Promise<void> => {
    if (shouldUseMockAPI()) {
      return mockAPI.listas.removeSaco(listaId, sacoId)
    }
    
    await api.delete(`/listas/${listaId}/sacos/${sacoId}`)
  },

  activate: async (id: number): Promise<Lista> => {
    if (shouldUseMockAPI()) {
      return mockAPI.listas.activate(id)
    }
    
    const response = await api.patch<Lista>(`/listas/${id}/activar`)
    return response.data
  },

  generateEnlace: async (id: number): Promise<Lista> => {
    if (shouldUseMockAPI()) {
      return mockAPI.listas.generateEnlace(id)
    }
    
    const response = await api.post<Lista>(`/listas/${id}/enlace-publico`)
    return response.data
  }
}

// Proformas API
export const proformasAPI = {
  getAll: async (page = 1, size = 20): Promise<PaginatedResponse<Proforma>> => {
    if (shouldUseMockAPI()) {
      return mockAPI.proformas.getAll(page, size)
    }
    
    const response = await api.get<PaginatedResponse<Proforma>>(`/proformas/?page=${page}&size=${size}`)
    return response.data
  },

  getById: async (id: number): Promise<Proforma> => {
    if (shouldUseMockAPI()) {
      return mockAPI.proformas.getById(id)
    }
    
    const response = await api.get<Proforma>(`/proformas/${id}`)
    return response.data
  },

  create: async (data: CreateProformaRequest): Promise<Proforma> => {
    if (shouldUseMockAPI()) {
      return mockAPI.proformas.create(data)
    }
    
    const response = await api.post<Proforma>('/proformas/', data)
    return response.data
  },

  emitir: async (id: number): Promise<Proforma> => {
    if (shouldUseMockAPI()) {
      return mockAPI.proformas.emitir(id)
    }
    
    const response = await api.post<Proforma>(`/proformas/${id}/emitir`)
    return response.data
  },

  getByCodigo: async (codigo: string): Promise<Proforma> => {
    if (shouldUseMockAPI()) {
      return mockAPI.proformas.getByCodigo(codigo)
    }
    
    const response = await api.get<Proforma>(`/proformas/codigo/${codigo}`)
    return response.data
  }
}

// Pagos API
export const pagosAPI = {
  getByProforma: async (proformaId: number): Promise<Pago[]> => {
    if (shouldUseMockAPI()) {
      return mockAPI.pagos.getByProforma(proformaId)
    }
    
    const response = await api.get<Pago[]>(`/pagos/proforma/${proformaId}`)
    return response.data
  },

  create: async (data: CreatePagoRequest): Promise<Pago> => {
    if (shouldUseMockAPI()) {
      return mockAPI.pagos.create(data)
    }
    
    const formData = new FormData()
    formData.append('proforma_id', data.proforma_id.toString())
    formData.append('monto', data.monto.toString())
    formData.append('metodo_pago', data.metodo_pago)
    if (data.observaciones) formData.append('observaciones', data.observaciones)
    if (data.voucher) formData.append('voucher', data.voucher)

    const response = await api.post<Pago>('/pagos/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}

// KPIs API
export const kpisAPI = {
  getDashboard: async (): Promise<KPIData> => {
    if (shouldUseMockAPI()) {
      return mockAPI.kpis.getDashboard()
    }
    
    const response = await api.get<KPIData>('/kpis/dashboard')
    return response.data
  },

  getDeudaProveedores: async (): Promise<DeudaProveedor[]> => {
    if (shouldUseMockAPI()) {
      return mockAPI.kpis.getDeudaProveedores()
    }
    
    const response = await api.get<DeudaProveedor[]>('/kpis/deuda-proveedores')
    return response.data
  }
}

export default api