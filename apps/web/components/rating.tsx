'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'

interface RatingProps {
  value: number
  onRate?: (rating: number) => void
  userRating?: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function Rating({ value, onRate, userRating, readonly = false, size = 'md' }: RatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const isActive = hoverRating ? star <= hoverRating : star <= value
        const isUserRated = userRating && star <= userRating

        return (
          <button
            key={star}
            type="button"
            className={cn(
              'focus-visible:ring-primary rounded-sm focus-visible:outline-none focus-visible:ring-2',
              !readonly && 'cursor-pointer transition-transform hover:scale-110',
              readonly && 'cursor-default',
            )}
            onClick={() => !readonly && onRate?.(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
          >
            <Star
              className={cn(
                sizeMap[size],
                'transition-colors',
                isActive && 'fill-yellow-400 text-yellow-400',
                isUserRated && 'fill-primary text-primary',
                !isActive && 'text-muted-foreground',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
