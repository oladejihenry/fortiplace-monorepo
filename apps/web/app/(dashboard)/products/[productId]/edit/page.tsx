import { BasicProductForm } from "@/components/products/basic-product-form"
import { Metadata } from "next"
import { getProductById } from "@/lib/action/products"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/custom-ui/loader"
import NotFound from "@/components/custom-ui/not-found"
// import EditProductCancel from "@/components/products/edit-product-cancel"

type Props = {
  params: Promise<{
    productId: string
  }>
}

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit your product details",
}

export default async function EditProductPage({params}: Props) {
  const {productId} = await params
  const initialData = await getProductById(productId)

  if(initialData.status === 404 || initialData?.status === 403) {
    return <NotFound />
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Editing: {initialData?.data?.name}</h1>
          <p className="text-muted-foreground">
            Manage your product information and files
          </p>
        </div>
        {/* <EditProductCancel /> */}
      </div>
      <Suspense
        fallback={<LoadingSpinner />}
      >
        <BasicProductForm initialData={initialData} />
      </Suspense>
      </div>
    </div>
  )
}
