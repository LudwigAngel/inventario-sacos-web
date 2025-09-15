'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { UserRole } from '@/types'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requiredRoles, fallback }: AuthGuardProps) {
  const { isAuthenticated, hasAnyRole } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requiredRoles && !hasAnyRole(requiredRoles)) {
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, hasAnyRole, requiredRoles, router])

  if (!isAuthenticated) {
    return fallback || <div>Cargando...</div>
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return fallback || <div>No tienes permisos para acceder a esta página</div>
  }

  return <>{children}</>
}

interface RoleGateProps {
  children: React.ReactNode
  requiredRoles: UserRole[]
  fallback?: React.ReactNode
}

export function RoleGate({ children, requiredRoles, fallback }: RoleGateProps) {
  const { hasAnyRole } = useAuthStore()

  if (!hasAnyRole(requiredRoles)) {
    return fallback || null
  }

  return <>{children}</>
}