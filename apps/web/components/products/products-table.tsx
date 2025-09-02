import { getProducts } from "@/lib/action/products"
import { ProductsList } from "./products-list"

interface SearchParams {
  page?: string
  per_page?: string
  search?: string
}

export async function ProductsTable({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { page, per_page, search } = params
  const products = await getProducts({
    page: Number(page) || 1,
    per_page: Number(per_page) || 15,
    search: search || '',
  })

  return <ProductsList products={products} />
}