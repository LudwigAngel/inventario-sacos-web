import { cn, getStatusColor } from '@/lib/utils'

interface StatusPillProps {
  status: string
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      getStatusColor(status),
      className
    )}>
      {status}
    </span>
  )
}