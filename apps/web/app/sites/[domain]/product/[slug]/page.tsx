import { LoadingSpinner } from "@/components/custom-ui/loader"
import { ProductView } from "@/components/sites/product-view"
import { getProductBySlug } from "@/lib/fetchers"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
interface Props {
    params: Promise<{
        domain: string
        slug: string
    }>
}

export async function generateMetadata({params}: Props) {
    const {domain, slug} = await params
    const decodedDomain = decodeURIComponent(domain)

    const product = await getProductBySlug(decodedDomain, slug)

    if(product.error || product.data?.is_published === false || product.status === 403) {
        notFound()
    }

    const capitalizedName = product.data.name.charAt(0).toUpperCase() + product.data.name.slice(1);

    return {
        title: capitalizedName,
        description: product.data.description,
        twitter: {
            card: "summary_large_image",
            title: capitalizedName,
            description: product.data.description,
            images: [product.data.cover_image],
        },
        openGraph: {
            title: capitalizedName,
            description: product.data.description,
            url: `https://${decodedDomain}/product/${slug}`,
            siteName: 'Fortiplace',
            images: [product.data.cover_image],
            type: 'website',
        },
    }
}

export default async function ProductPage({params}: Props) {

   const {domain, slug} = await params
   const decodedDomain = decodeURIComponent(domain)
   const headersList = await headers()
   const userAgent = headersList.get('User-Agent')
   const product = await getProductBySlug(decodedDomain, slug, userAgent ? { 'user-agent': userAgent } : undefined)

    if(!product || product.data?.is_published === false || product.status === 403) {
        notFound()
    }
    return (
        <div className="flex flex-col space-y-8">
            <Suspense fallback={<LoadingSpinner />}>
                <ProductView product={product} />
            </Suspense>
        </div>
    )
}