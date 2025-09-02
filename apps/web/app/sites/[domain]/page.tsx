import { LoadingSpinner } from "@/components/custom-ui/loader"
import { ProductGrid } from "@/components/sites/product-grid"
import { getProductsByDomain } from "@/lib/fetchers"
import { Suspense } from "react"

type Props = {
    params: Promise<{
        domain: string
    }>
}


async function Products({ domain }: { domain: string }) {
    const products = await getProductsByDomain(domain)
    return <ProductGrid products={products} />
}

export default async function SiteStorePage({ params }: Props) {
    const { domain } = await params

    const decodedDomain = decodeURIComponent(domain)

    return (
        <div className="flex flex-col space-y-8 py-8">
            <Suspense fallback={<LoadingSpinner />}>
                <Products domain={decodedDomain} />
            </Suspense>
        </div> 
    )
}