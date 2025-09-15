'use client'

import { Button } from 'flowbite-react'
import { HiDownload } from 'react-icons/hi'
import { exportToPDF, exportToPNG } from '@/lib/pdf-utils'
import { toast } from 'react-hot-toast'

interface ExportButtonsProps {
  elementId: string
  filename: string
  className?: string
}

export function PdfButton({ elementId, filename, className }: ExportButtonsProps) {
  const handleExport = async () => {
    try {
      await exportToPDF(elementId, filename)
      toast.success('PDF exportado correctamente')
    } catch (error) {
      toast.error('Error al exportar PDF')
      console.error(error)
    }
  }

  return (
    <Button
      color="failure"
      size="sm"
      onClick={handleExport}
      className={className}
    >
      <HiDownload className="mr-2 h-4 w-4" />
      PDF
    </Button>
  )
}

export function PngButton({ elementId, filename, className }: ExportButtonsProps) {
  const handleExport = async () => {
    try {
      await exportToPNG(elementId, filename)
      toast.success('PNG exportado correctamente')
    } catch (error) {
      toast.error('Error al exportar PNG')
      console.error(error)
    }
  }

  return (
    <Button
      color="info"
      size="sm"
      onClick={handleExport}
      className={className}
    >
      <HiDownload className="mr-2 h-4 w-4" />
      PNG
    </Button>
  )
}