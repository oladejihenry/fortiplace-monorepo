"use client"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { formatPrice, getPriceForCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { Skeleton } from "@workspace/ui/components/skeleton"
import Image from "next/image"
import Link from "next/link"
import { CallToAction } from "@/types/product"
import { useCartStore } from "@/store/use-cart-store"
import { useCurrencyStore } from "@/store/use-currency-store"
import { Price } from "@/types"
import { Rating } from "../rating"
import { useRating } from "@/hooks/use-rating"
import { notFound } from "next/navigation"
import { SocialShare } from "./social-share"


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
  if(product.error === true) {
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
          email: product.data.creator?.email || ''
        },
        prices: product.data.prices || []
      })
     toast.success("Item added to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const callToAction = product.data?.metadata?.callToAction
  const callToActionText = callToAction === CallToAction.BUY_NOW ? "Buy Now" : callToAction === CallToAction.I_WANT_THIS ? "I Want This" : "Pay Now"

  const { handleRate } = useRating(product.data.product_id)

  // Calculate average rating
  const averageRating = product.data.ratings && product.data.ratings.length > 0 ? 
    (product.data.ratings.reduce((acc, rating) => acc + rating.rating, 0) / product.data.ratings.length).toFixed(1) : 
    "0.0"

    // Get ratings count
  const ratingsCount = product.data.ratings?.length || 0

  // Get user rating if exists (you'll need to implement session_id check)
  const userRating = product.data.ratings?.find(r => r.session_id === "current_session_id")?.rating

  return (
    <div className="mt-10 mb-10">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-black">
        <Image
          src={product.data?.cover_image}
          alt={product.data?.name}
          fill
          className="object-cover opacity-90"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-4">
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
                <span className="text-white text-sm capitalize">{product.data.creator.username}</span>
              </Link>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white max-w-2xl">
            {product.data?.name}
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row border ">
        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 lg:pr-8">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {/* <h2 className="text-xl font-semibold mb-4">About This Webinar</h2> */}
            <div dangerouslySetInnerHTML={{ __html: product.data.content }} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-[380px] space-y-6 border-l ">
          <div className="sticky top-4">
            <div className="rounded-lg  p-6 space-y-6">
              <div className="flex flex-col">
                {product.data.slashed_price && product.data.slashed_price > 0 ? (
                  <div className="flex flex-col gap-0.5 mt-1">
                    <Badge className="bg-[#00A99D] hover:bg-[#00A99D]/80 text-white w-fit">
                      {formatPrice(getPriceForCurrency(product.data.prices, selectedCurrency), selectedCurrency)}
                    </Badge>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.data.slashed_price, selectedCurrency)}
                    </span>
                  </div>
                ) : (
                  <Badge className="bg-[#00A99D] hover:bg-[#00A99D]/80 text-white w-fit mt-1">
                    {formatPrice(getPriceForCurrency(product.data.prices, selectedCurrency), selectedCurrency)}
                  </Badge>
                )}
              </div>

              <Button 
                size="lg" 
                className="w-full bg-[#00A99D] hover:bg-[#00A99D]/90 text-white h-14 text-lg"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : `${callToActionText}`}
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rating 
                      value={Number(averageRating)}
                      onRate={handleRate}
                      userRating={userRating}
                    />
                    <span className="text-sm font-medium">
                      {averageRating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {ratingsCount} {ratingsCount === 1 ? 'rating' : 'ratings'}
                  </span>
                </div>
                {userRating && (
                  <p className="text-sm text-muted-foreground">
                    You rated this {userRating} stars
                  </p>
                )}
              </div>

              <SocialShare product={product.data} />

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4 border-t">
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
    <div className="max-w-7xl mx-auto">
      <Skeleton className="w-full h-[300px] md:h-[400px]" />
      <div className="px-4 py-8 md:px-8 max-w-4xl mx-auto space-y-8">
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
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  )
}