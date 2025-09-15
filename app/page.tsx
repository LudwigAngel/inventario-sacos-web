'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-amber-900/20 dark:via-gray-900 dark:to-yellow-900/20">
      <div className="text-center">
        <div className="mb-6">
          <img 
            src="/logo_negro_sin_nombre.png" 
            alt="JHC INVENTARIOS" 
            className="h-20 w-auto mx-auto"
          />
        </div>
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 dark:border-amber-700 mx-auto"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500 dark:border-amber-400 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <p className="mt-6 text-amber-700 dark:text-amber-300 font-medium">Cargando JHC INVENTARIOS...</p>
      </div>
    </div>
  )
}
