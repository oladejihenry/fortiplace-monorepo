'use client'

import { Star } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'

interface DisplayRatingProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function DisplayRating({ value, size = 'md' }: DisplayRatingProps) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const isActive = star <= value

        return (
          <div key={star} className="flex items-center">
            <Star
              className={cn(
                sizeMap[size],
                'transition-colors',
                isActive && 'fill-yellow-400 text-yellow-400',
                !isActive && 'text-muted-foreground',
              )}
            />
          </div>
        )
      })}
    </div>
  )
}
