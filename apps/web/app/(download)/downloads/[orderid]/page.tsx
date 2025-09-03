import NotFound from '@/app/not-found'
import { DownloadRating } from '@/components/downloads/download-rating'
import { ProductActionButton } from '@/components/downloads/product-action-button'
import { VerifyEmailForm } from '@/components/downloads/verify-email-form'
import axios from '@/lib/axios'
import { ProductType } from '@/types/product'
import { AxiosError } from 'axios'
import { CheckCircle, FileText, Info } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Downloads',
  description: 'Download your purchased products',
}

interface Product {
  id: string
  name: string
  product_id: string
  description: string
  product_type: ProductType
  download_url: string
  file_name: string
  view_product_online: boolean
  rating?: number
}

interface Order {
  id: string
  user_id: string
  customer_email: string
  created_at: string
  total_amount: number
  currency: string
  rating?: number
}

interface VerifiedData {
  order: Order
  products: Product[]
}

async function verifyToken(token: string): Promise<VerifiedData | null> {
  try {
    const response = await axios.get(`/api/downloads/verify?token=${token}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      return null
    }
    throw error
  }
}

// Helper function to format product type
function formatProductType(type: ProductType): string {
  switch (type) {
    case ProductType.DIGITAL:
      return 'Digital Product'
    case ProductType.EBOOK:
      return 'eBook'
    case ProductType.PHYSICAL:
      return 'Physical Product'
    case ProductType.COURSE:
      return 'Course'
    default:
      return 'Product'
  }
}

export default async function DownloadPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ token: string }>
  params: Promise<{ orderid: string }>
}) {
  const { token } = await searchParams
  const { orderid } = await params

  if (!token) {
    return <NotFound />
  }

  const verifiedData = await verifyToken(token)

  if (!verifiedData) {
    return <VerifyEmailForm orderId={orderid} />
  }

  const { order, products } = verifiedData

  // const ratingsCount = product.data.ratings?.length || 0
  // const averageRating =
  //   products.ratings && products.ratings.length > 0
  //     ? (
  //         products.ratings.reduce((acc, rating) => acc + rating.rating, 0) / products.ratings.length
  //       ).toFixed(1)
  //     : '0.0'

  return (
    <div className="py-8">
      <div className="bg-card mx-auto max-w-4xl rounded-lg p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Your Downloads</h1>

        <div className="mb-6">
          <p className="text-muted-foreground mb-1">Order ID: {order.id}</p>
          <p className="text-muted-foreground text-sm">
            These download links are valid for 30 days. If a link expires, simply return to this
            page to generate new download links.
          </p>
        </div>

        <div className="mb-6 space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border-border bg-card hover:bg-accent/5 rounded-lg border p-4 transition duration-150"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <h3 className="font-semibold capitalize">{product.name}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {formatProductType(product.product_type)}
                  </p>
                  <div className="mt-3">
                    <DownloadRating product={product} />
                  </div>
                </div>
                {/* <a
                    href={product.download_url}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-md transition duration-150 text-center sm:whitespace-nowrap"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a> */}
                <ProductActionButton
                  downloadUrl={product.download_url}
                  fileName={product.file_name}
                  viewOnline={product.view_product_online}
                  token={token}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground border-border space-y-2 border-t pt-4 text-sm">
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>You have lifetime access to these files</span>
          </p>
          <p className="flex items-center">
            <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>Download links are refreshed every time you visit this page</span>
          </p>
          <p className="flex items-center">
            <Info className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>For any issues, please contact support at support@fortiplace.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}
