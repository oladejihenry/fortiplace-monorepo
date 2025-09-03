'use client'

import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { formatPrice, getPriceForCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { Skeleton } from '@workspace/ui/components/skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { CallToAction } from '@/types/product'
import { useCartStore } from '@/store/use-cart-store'
import { useCurrencyStore } from '@/store/use-currency-store'
import { Price } from '@/types'
import { notFound } from 'next/navigation'
import { SocialShare } from './social-share'
import { DisplayRating } from '../DisplayRating'

interface ProductData {
  id: string
  product_id: string
  name: string
  price: number
  slashed_price: number
  cover_image: string
  product_type: string
  content: string
  metadata?: {
    currency: string
    callToAction: CallToAction
  }
  creator?: {
    username: string
    email: string
  }
  prices?: Price[]
  ratings?: Rating[]
}

interface Rating {
  id: string
  product_id: string
  user_id: string | null
  rating: number
  session_id: string
  created_at: string
  updated_at: string
}

interface ProductViewProps {
  product: {
    error?: boolean
    data: ProductData
  }
}

export function ProductView({ product }: ProductViewProps) {
  if (product.error === true) {
    notFound()
  }
  const addItem = useCartStore((state) => state.addItem)
  const { isLoading, setIsLoading } = useCartStore()
  const { selectedCurrency } = useCurrencyStore()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      addItem({
        id: product.data.id,
        product_id: product.data.product_id,
        name: product.data.name,
        price: getPriceForCurrency(product.data.prices, selectedCurrency),
        currency: product.data.metadata?.currency || 'NGN',
        cover_image: product.data.cover_image,
        product_type: product.data.product_type,
        quantity: 1,
        creator: {
          username: product.data.creator?.username || '',
          email: product.data.creator?.email || '',
        },
        prices: product.data.prices || [],
      })
      toast.success('Item added to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const callToAction = product.data?.metadata?.callToAction
  const callToActionText =
    callToAction === CallToAction.BUY_NOW
      ? 'Buy Now'
      : callToAction === CallToAction.I_WANT_THIS
        ? 'I Want This'
        : 'Pay Now'

  // Calculate average rating
  const averageRating =
    product.data.ratings && product.data.ratings.length > 0
      ? (
          product.data.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
          product.data.ratings.length
        ).toFixed(1)
      : '0.0'

  // Get ratings count
  const ratingsCount = product.data.ratings?.length || 0

  return (
    <div className="mb-10 mt-10">
      {/* Hero Banner Section */}
      <div className="relative h-[300px] w-full overflow-hidden bg-black md:h-[400px]">
        <Image
          src={product.data?.cover_image}
          alt={product.data?.name}
          fill
          className="object-cover opacity-90"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 space-y-4 p-6 md:p-8">
          <div className="flex items-center gap-3">
            {product.data.creator && (
              <Link href="#" className="flex items-center gap-2">
                {/* <Image
                  src={product.data.creator.avatar}
                  alt={product.data.creator.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                /> */}
                <span className="text-sm capitalize text-white">
                  {product.data.creator.username}
                </span>
              </Link>
            )}
          </div>
          <h1 className="max-w-2xl text-3xl font-bold text-white md:text-4xl">
            {product.data?.name}
          </h1>
        </div>
      </div>

      <div className="flex flex-col border lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 lg:pr-8">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {/* <h2 className="text-xl font-semibold mb-4">About This Webinar</h2> */}
            <div dangerouslySetInnerHTML={{ __html: product.data.content }} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 border-l lg:w-[380px]">
          <div className="sticky top-4">
            <div className="space-y-6 rounded-lg p-6">
              <div className="flex flex-col">
                {product.data.slashed_price && product.data.slashed_price > 0 ? (
                  <div className="mt-1 flex flex-col gap-0.5">
                    <Badge className="w-fit bg-[#00A99D] text-white hover:bg-[#00A99D]/80">
                      {formatPrice(
                        getPriceForCurrency(product.data.prices, selectedCurrency),
                        selectedCurrency,
                      )}
                    </Badge>
                    <span className="text-muted-foreground text-sm line-through">
                      {formatPrice(product.data.slashed_price, selectedCurrency)}
                    </span>
                  </div>
                ) : (
                  <Badge className="mt-1 w-fit bg-[#00A99D] text-white hover:bg-[#00A99D]/80">
                    {formatPrice(
                      getPriceForCurrency(product.data.prices, selectedCurrency),
                      selectedCurrency,
                    )}
                  </Badge>
                )}
              </div>

              <Button
                size="lg"
                className="h-14 w-full bg-[#00A99D] text-lg text-white hover:bg-[#00A99D]/90"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : `${callToActionText}`}
              </Button>

              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l2 2" />
                </svg>
                Check your email after purchase
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DisplayRating value={Number(averageRating)} />
                    <span className="text-sm font-medium">{averageRating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {ratingsCount} {ratingsCount === 1 ? 'rating' : 'ratings'}
                  </span>
                </div>
              </div>

              <SocialShare product={product.data} />

              <div className="text-muted-foreground flex items-center justify-center gap-2 border-t pt-4 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
                </svg>
                30-day money back guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProductView.Skeleton = function ProductViewSkeleton() {
  return (
    <div className="mx-auto max-w-7xl">
      <Skeleton className="h-[300px] w-full md:h-[400px]" />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 md:px-8">
        <div className="space-y-4">
          <Skeleton className="h-14 w-full" />
          <div className="flex justify-between gap-4">
            <Skeleton className="h-9 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
        <Skeleton className="mx-auto h-4 w-48" />
      </div>
    </div>
  )
}
