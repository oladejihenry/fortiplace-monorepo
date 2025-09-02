'use client'
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import Image from "next/image"
import { getPriceForCurrency, formatPrice, formatProductType } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Share2, ShoppingCart } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { useCurrencyStore } from "@/store/use-currency-store"
import { memo } from "react"

interface Price {
    currency: string
    price: number
    regularPrice: number | null
}

interface ProductData {
    id: string
    product_id: string
    product_url: string
    name: string
    description: string | null
    content: string
    price: number
    slashed_price: number
    prices: Price[]
    cover_image: string
    created_at: string
    updated_at: string
    product_type: string
    metadata: {
        currency: string
    }
}

interface PaginationLinks {
    first: string
    last: string
    prev: string | null
    next: string | null
}

interface PaginationMeta {
    current_page: number
    from: number
    last_page: number
    path: string
    per_page: number
    to: number
    total: number
}

interface PaginatedResponse {
    data: ProductData[]
    links: PaginationLinks
    meta: PaginationMeta
}

interface ProductGridProps {
    products: PaginatedResponse
    isLoading?: boolean
}

// Memoize individual product card to prevent unnecessary re-renders
const ProductCard = memo(({ product, selectedCurrency }: { product: ProductData, selectedCurrency: string }) => (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg py-0">
        <Link href={`/product/${product.product_id}`} className="block">
            <CardHeader className="p-0 relative">
                <div className="aspect-[4/3] relative overflow-hidden rounded-lg bg-gray-100">
                    <Image
                        src={product.cover_image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={95}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        style={{ transform: 'translate3d(0, 0, 0)' }}
                    />
                    <Badge 
                        className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm"
                        variant="secondary"
                    >
                        {formatProductType(product.product_type)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <h3 className="font-medium line-clamp-1 group-hover:text-primary">
                    {product.name}
                </h3>
                <div className="flex flex-col">
                    {product.slashed_price && product.slashed_price > 0 ? (
                        <div className="flex flex-col gap-0.5 mt-1">                            
                            <span className="text-base font-medium ">
                                {formatPrice(getPriceForCurrency(product.prices, selectedCurrency), selectedCurrency)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.slashed_price, selectedCurrency)}
                            </span>
                        </div>
                    ) : (
                        <p className="text-base font-medium mt-1">
                            {formatPrice(getPriceForCurrency(product.prices, selectedCurrency), selectedCurrency)}
                        </p>
                    )}
                </div>
                <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                    </Button>
                    <Button size="icon" variant="ghost">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Link>
    </Card>
))

ProductCard.displayName = 'ProductCard'

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
    const productsData = products?.data || []
    const { selectedCurrency } = useCurrencyStore()

    if (productsData.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-hidden py-0">
                        <CardHeader className="p-0">
                            <Skeleton className="h-48 rounded-none" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/3 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden py-0">
                        <CardHeader className="p-0">
                            <Skeleton className="h-48 rounded-none" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/3 mt-2" />
                        </CardContent>
                    </Card>
                ))
                : productsData.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product}
                        selectedCurrency={selectedCurrency}
                    />
                ))}
        </div>
    )
}