import { type ClassValue, clsx } from 'clsx'
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'dd/MM/yyyy', { locale: es })
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es })
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es })
}

export function isExpired(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return isBefore(dateObj, new Date())
}

export function isExpiringSoon(date: string | Date, hoursThreshold = 24): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const threshold = new Date()
  threshold.setHours(threshold.getHours() + hoursThreshold)
  return isAfter(dateObj, new Date()) && isBefore(dateObj, threshold)
}

export function generateQRData(sacoId: number): string {
  return `SACO-${sacoId.toString().padStart(6, '0')}`
}

export function parseQRData(qrData: string): number | null {
  const match = qrData.match(/^SACO-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Pedidos
    CREADO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    EN_TRANSITO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    RECIBIDO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    CERRADO: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    
    // Sacos
    DISPONIBLE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    RESERVADO: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    VENDIDO: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    
    // Proformas
    EMITIDA: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    RESERVA: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    PAGADA: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    VENCIDA: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    DESPACHADA: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  }
  
  return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

export function getTipoColor(tipo: string): string {
  const tipoColors: Record<string, string> = {
    CASUAL_HOMBRE: 'bg-jaguar-200 text-coffee-800 dark:bg-coffee-700 dark:text-jaguar-200',
    CASUAL_MUJER: 'bg-jaguar-300 text-coffee-900 dark:bg-coffee-600 dark:text-jaguar-100',
    DEPORTIVO_HOMBRE: 'bg-jaguar-400 text-dark-900 dark:bg-coffee-800 dark:text-jaguar-300',
    DEPORTIVO_MUJER: 'bg-jaguar-500 text-dark-900 dark:bg-coffee-700 dark:text-jaguar-200',
    INFANTIL_NINO: 'bg-jaguar-300 text-coffee-800 dark:bg-coffee-600 dark:text-jaguar-200',
    INFANTIL_NINA: 'bg-jaguar-400 text-coffee-900 dark:bg-coffee-700 dark:text-jaguar-100',
    FORMAL_HOMBRE: 'bg-coffee-400 text-jaguar-100 dark:bg-coffee-800 dark:text-jaguar-300',
    FORMAL_MUJER: 'bg-coffee-500 text-jaguar-100 dark:bg-coffee-700 dark:text-jaguar-200',
  }
  
  return tipoColors[tipo] || 'bg-coffee-300 text-jaguar-900 dark:bg-coffee-800 dark:text-jaguar-300'
}

export function getCategoriaColor(categoria: string): string {
  const categoriaColors: Record<string, string> = {
    HOMBRE: 'bg-coffee-400 text-jaguar-100 dark:bg-coffee-700 dark:text-jaguar-200',
    MUJER: 'bg-jaguar-400 text-coffee-900 dark:bg-jaguar-700 dark:text-coffee-200',
    NINO: 'bg-jaguar-300 text-coffee-800 dark:bg-jaguar-800 dark:text-coffee-300',
    NINA: 'bg-coffee-300 text-jaguar-800 dark:bg-coffee-800 dark:text-jaguar-300',
  }
  
  return categoriaColors[categoria] || 'bg-coffee-300 text-jaguar-900 dark:bg-coffee-800 dark:text-jaguar-300'
}

export function getTemporadaColor(temporada: string): string {
  const temporadaColors: Record<string, string> = {
    VERANO: 'bg-jaguar-500 text-dark-900 dark:bg-jaguar-700 dark:text-jaguar-100',
    INVIERNO: 'bg-coffee-500 text-jaguar-100 dark:bg-coffee-700 dark:text-jaguar-200',
    OTONO: 'bg-jaguar-600 text-dark-900 dark:bg-coffee-600 dark:text-jaguar-200',
  }
  
  return temporadaColors[temporada] || 'bg-coffee-400 text-jaguar-100 dark:bg-coffee-800 dark:text-jaguar-300'
}