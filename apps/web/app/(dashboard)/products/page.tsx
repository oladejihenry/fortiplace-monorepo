import { ProductsHeader } from "@/components/products/products-header"
import { Metadata } from "next"
import { Suspense } from "react"
import { ProductsTable } from "@/components/products/products-table"
import Loading from "../loading"


export const metadata: Metadata = {
  title: "Products",
  description: "Products",
}

interface SearchParams {
  page?: string
  per_page?: string
  search?: string
}


export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {


  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <ProductsHeader />
        <Suspense fallback={<Loading />}>
          <ProductsTable searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

