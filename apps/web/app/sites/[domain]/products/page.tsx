import { LoadingSpinner } from "@/components/custom-ui/loader";
import { ProductGrid } from "@/components/sites/product-grid";
import { Suspense } from "react";
import { getProductsByDomain } from "@/lib/fetchers";
import { ProductSort } from "@/components/sites/product-sort";
type Props = {
    params: Promise<{
        domain: string
    }>
    searchParams: Promise<{
        sort?: string
    }>
}

export default async function ProductsPage({ params, searchParams }: Props) {
    const { domain } = await params
    const { sort = 'relevance' } = await searchParams
 
    const decodedDomain = decodeURIComponent(domain)
    const products = await getProductsByDomain(decodedDomain, { sort })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">All Products</h1>
                        <ProductSort />
                    </div>
                    <Suspense fallback={<LoadingSpinner />}>
                        <ProductGrid products={products} />
                    </Suspense>
            </div>
        </div>
    )
}