import { Card } from 'flowbite-react'
import { QrBadge } from './QrBadge'
import { StatusPill } from './StatusPill'
import { formatCurrency, getTipoColor, getTemporadaColor, getCategoriaColor } from '@/lib/utils'
import type { Saco } from '@/types'

interface SacoCardProps {
  saco: Saco
  onClick?: () => void
  selected?: boolean
  showQR?: boolean
  className?: string
}

export function SacoCard({ 
  saco, 
  onClick, 
  selected = false, 
  showQR = false,
  className 
}: SacoCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        selected ? 'ring-2 ring-primary-400' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-2 flex-wrap">
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
          
          <div className="mb-3">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(saco.precio_base)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tallas: {saco.tallas_incluidas?.join(', ') || 'N/A'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              ID: {saco.id}
            </p>
          </div>

          {saco.descripcion_contenido && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {saco.descripcion_contenido}
              </p>
            </div>
          )}

          <StatusPill status={saco.estado} />
          
          {saco.observaciones && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {saco.observaciones}
            </p>
          )}
        </div>

        {showQR && (
          <div className="ml-4">
            <QrBadge value={saco.qr_code} size={80} />
          </div>
        )}
      </div>
    </Card>
  )
}