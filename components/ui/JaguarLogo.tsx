'use client'

interface JaguarLogoProps {
  variant?: 'login' | 'dorado' | 'negro'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8', 
  lg: 'h-10 w-10',
  xl: 'h-12 w-12'
}

const logoSources = {
  login: '/logo_dorado_login.png',
  dorado: '/logo_dorado_sin_nombre.png',
  negro: '/logo_negro_sin_nombre.png'
}

export function JaguarLogo({ 
  variant = 'dorado', 
  size = 'md', 
  className = '' 
}: JaguarLogoProps) {
  return (
    <img 
      src={logoSources[variant]}
      alt="Jaguar Logo" 
      className={`${sizeClasses[size]} ${className}`}
    />
  )
}