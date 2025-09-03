'use client'
import { Rating } from '../rating'
import { useRating } from '@/hooks/use-rating'

interface Product {
  id: string
  name: string
  product_id?: string
  user_rating?: number
  ratings?: Array<{
    id: string
    product_id: string
    rating: number
    customer_email: string
    created_at: string
    user_id: string
  }>
}
interface DownloadOrderRatingProps {
  product: Product
}

export function DownloadRating({ product }: DownloadOrderRatingProps) {
  const { handleRate } = useRating(product.product_id || '')
  const averageRating =
    product.ratings && product.ratings.length > 0
      ? (
          product.ratings.reduce((acc, rating) => acc + rating.rating, 0) / product.ratings.length
        ).toFixed(1)
      : '0.0'

  const userRating = product.ratings?.find((rating) => rating.product_id === product.id)

  const ratingCount = product.ratings?.length

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Rating
          value={Number(averageRating)}
          onRate={handleRate}
          userRating={userRating?.rating}
          size="sm"
        />
        <span className="text-muted-foreground text-sm">{averageRating}</span>
      </div>

      {product?.ratings?.length && product.ratings?.length > 0 && (
        <span className="text-muted-foreground text-xs">
          ({product.ratings.length} {product.ratings.length === 1 ? 'rating' : 'ratings'})
        </span>
      )}

      {userRating && (
        <span className="text-xs font-medium text-emerald-600">
          You rated: {userRating?.rating} stars
        </span>
      )}
    </div>
  )
}
