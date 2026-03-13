import { cn } from '../../lib/utils'
import { SelectHTMLAttributes, forwardRef } from 'react'

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow appearance-none',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'
export { Select }
