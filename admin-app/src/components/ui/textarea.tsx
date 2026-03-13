import { cn } from '../../lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 resize-y min-h-[80px]',
        'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
export { Textarea }
