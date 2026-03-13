import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'draft'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-slate-100 text-slate-600': variant === 'default',
          'border border-slate-300 text-slate-700 bg-transparent': variant === 'outline',
          'bg-green-100 text-green-700': variant === 'success',
          'bg-orange-100 text-orange-700': variant === 'warning',
          'bg-slate-100 text-slate-500': variant === 'draft',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
