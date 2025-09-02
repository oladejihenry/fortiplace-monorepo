import { Metadata } from "next"
import { NewProductHeader } from "@/components/products/new-product-header"
import { ProductTypeSelector } from "@/components/products/product-type-selector"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/custom-ui/loader"
export const metadata: Metadata = {
  title: "Create New Product",
  description: "Create and publish your product",
}

export default function NewProductPage() {
  return (

    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <NewProductHeader />
      <Suspense fallback={<LoadingSpinner />}>
        <ProductTypeSelector />
      </Suspense>
    </div>
  )
}