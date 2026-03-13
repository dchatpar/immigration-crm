import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

export function Avatar({ className, src, alt, fallback, size = 'md', ...props }: AvatarProps) {
  const [error, setError] = React.useState(false)

  const initials = fallback || alt?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div 
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-gray-200',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !error ? (
        <Image 
          src={src} 
          alt={alt || ''} 
          fill
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600 font-medium">
          {initials}
        </div>
      )}
    </div>
  )
}

export function AvatarGroup({ children, max = 4, className }: { children: React.ReactNode; max?: number; className?: string }) {
  const childArray = React.Children.toArray(children)
  const visible = childArray.slice(0, max)
  const remaining = childArray.length - max

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((child, index) => (
        <div key={index} className="relative ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  )
}
