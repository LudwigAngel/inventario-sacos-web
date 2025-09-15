// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  COMPRAS = 'COMPRAS',
  ALMACEN = 'ALMACEN',
  VENDEDOR = 'VENDEDOR',
  PAGOS = 'PAGOS',
  DESPACHO = 'DESPACHO'
}

export enum PedidoEstado {
  CREADO = 'CREADO',
  EN_TRANSITO = 'EN_TRANSITO',
  RECIBIDO = 'RECIBIDO',
  CERRADO = 'CERRADO'
}

export enum SacoEstado {
  RECIBIDO = 'RECIBIDO',
  DISPONIBLE = 'DISPONIBLE',
  RESERVADO = 'RESERVADO',
  VENDIDO = 'VENDIDO'
}

export enum ProformaEstado {
  EMITIDA = 'EMITIDA',
  RESERVA = 'RESERVA',
  PAGADA = 'PAGADA',
  VENCIDA = 'VENCIDA',
  DESPACHADA = 'DESPACHADA'
}

export enum ListaTipo {
  VIP = 'VIP',
  BASE = 'BASE'
}

export enum SacoTipo {
  CASUAL_HOMBRE = 'CASUAL_HOMBRE',
  CASUAL_MUJER = 'CASUAL_MUJER',
  DEPORTIVO_HOMBRE = 'DEPORTIVO_HOMBRE',
  DEPORTIVO_MUJER = 'DEPORTIVO_MUJER',
  INFANTIL_NINO = 'INFANTIL_NINO',
  INFANTIL_NINA = 'INFANTIL_NINA',
  FORMAL_HOMBRE = 'FORMAL_HOMBRE',
  FORMAL_MUJER = 'FORMAL_MUJER'
}

export enum Temporada {
  VERANO = 'VERANO',
  INVIERNO = 'INVIERNO',
  OTONO = 'OTONO'
}

export enum Categoria {
  NINO = 'NINO',
  NINA = 'NINA',
  HOMBRE = 'HOMBRE',
  MUJER = 'MUJER'
}

// DTOs
export interface User {
  id: number
  username: string
  nombre: string
  rol: UserRole
  activo: boolean
  created_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Proveedor {
  id: number
  nombre: string
  contacto?: string
  telefono?: string
  activo: boolean
}

export interface Pedido {
  id: number
  proveedor_id: number
  proveedor?: Proveedor
  fecha_pedido: string
  fecha_entrega_estimada?: string
  estado: PedidoEstado
  observaciones?: string
  total_sacos?: number
  created_at: string
}

export interface Saco {
  id: number
  pedido_id?: number
  pedido?: Pedido
  tipo: SacoTipo
  temporada: Temporada
  categoria: Categoria
  tallas_incluidas: string[] // Ej: ['S', 'M', 'L', 'XL']
  descripcion_contenido: string // Ej: 'Saco de shorts y polos deportivos'
  precio_base: number
  estado: SacoEstado
  qr_code: string
  observaciones?: string
  created_at: string
}

export interface Lista {
  id: number
  nombre: string
  tipo: ListaTipo
  activa: boolean
  enlace_publico?: string
  created_at: string
  sacos?: Saco[]
}

export interface Proforma {
  id: number
  codigo_seguimiento: string // Código único para que el cliente haga seguimiento
  lista_id?: number
  lista?: Lista
  cliente_nombre: string
  cliente_telefono?: string
  cliente_email?: string
  estado: ProformaEstado
  descuento_global: number
  descuento_manual?: number // Descuento manual aplicado por vendedor
  total_original: number // Total sin descuentos
  total: number // Total final con descuentos
  fecha_expiracion?: string
  created_at: string
  lineas?: ProformaLinea[]
}

export interface ProformaLinea {
  id: number
  proforma_id: number
  saco_id: number
  saco?: Saco
  precio_unitario: number
  descuento_linea: number
  subtotal: number
}

export interface Pago {
  id: number
  proforma_id: number
  proforma?: Proforma
  monto: number
  metodo_pago: string
  voucher_url?: string
  observaciones?: string
  created_at: string
}

export interface DeudaProveedor {
  proveedor_id: number
  proveedor_nombre: string
  total_deuda: number
  pedidos_pendientes: number
}

export interface KPIData {
  stock_disponible: number
  reservas_por_vencer: number
  ventas_del_dia: number
  deuda_proveedor: number
}

// Request/Response types
export interface CreatePedidoRequest {
  proveedor_id: number
  fecha_entrega_estimada?: string
  observaciones?: string
}

export interface CreateSacoRequest {
  pedido_id?: number
  tipo: SacoTipo
  temporada: Temporada
  categoria: Categoria
  tallas_incluidas: string[]
  descripcion_contenido: string
  precio_base: number
  observaciones?: string
}

export interface CreateListaRequest {
  nombre: string
  tipo: ListaTipo
}

export interface CreateProformaRequest {
  lista_id?: number
  cliente_nombre: string
  cliente_telefono?: string
  cliente_email?: string
  descuento_global?: number
  descuento_manual?: number
  lineas: {
    saco_id: number
    precio_unitario: number
    descuento_linea?: number
  }[]
}

export interface SeguimientoPedidoRequest {
  codigo_seguimiento: string
}

export interface CreatePagoRequest {
  proforma_id: number
  monto: number
  metodo_pago: string
  voucher?: File
  observaciones?: string
}

// UI Types
export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

export interface FilterOption {
  value: string
  label: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}