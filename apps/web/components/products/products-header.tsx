'use client'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { useProducts } from '@/hooks/useProduct'
import { Plus, ArrowLeft } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'

export function ProductsHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const isNewProductPage = pathname === '/products/new'

  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))

  const { data: products } = useProducts()

  //products count
  const productsCount = products?.data.length

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {isNewProductPage && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {isNewProductPage ? 'Create New Product' : 'Products'}
          </h2>
          {!isNewProductPage && productsCount && (
            <span className="bg-muted relative box-border inline-flex h-8 items-center rounded-full px-2 text-sm font-medium">
              {productsCount}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {!isNewProductPage && (
          <>
            <Input
              placeholder="Search products..."
              className="max-w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value || null)}
            />
            <Button onClick={() => router.push('/products/new')} className="text-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              New Product
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
