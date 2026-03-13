import { cn } from '../../lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 font-medium transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1',
          {
            'bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500': variant === 'primary',
            'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300': variant === 'secondary',
            'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'danger',
            'text-gray-600 hover:bg-gray-100 focus:ring-gray-300': variant === 'ghost',
          },
          {
            'text-xs px-3 py-1.5': size === 'sm',
            'text-sm px-4 py-2': size === 'md',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
export { Button }
