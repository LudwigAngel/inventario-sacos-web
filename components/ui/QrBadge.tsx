'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QrBadgeProps {
  value: string
  size?: number
  className?: string
}

export function QrBadge({ value, size = 100, className }: QrBadgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    }
  }, [value, size])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={size}
      height={size}
    />
  )
}