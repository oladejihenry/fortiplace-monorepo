import { PaginatedResponse, Product } from "@/types/product"
import { PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@workspace/ui/components/pagination"

import { PaginationContent } from "@workspace/ui/components/pagination"

import { Pagination } from "@workspace/ui/components/pagination"
import { usePathname, useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

interface ProductsListProps {
  products: PaginatedResponse<Product>
}

export function ProductsPagination({ products }: ProductsListProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, String(value))
      }
    })
    
    return newSearchParams.toString()
  }
    const handlePageChange = (newPage: number) => {
    router.push(
      `${pathname}?${createQueryString({ page: newPage })}`
    )
  }
  return (
    <>
        {products.meta.total > products.meta.per_page && (
            <Pagination className="justify-end">
                <PaginationContent>
                {products.meta.links.map((link, i) => {
                    // Skip prev/next links as we'll handle them separately
                    if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                    return null
                    }

                    // Show ellipsis
                    if (link.label === '...') {
                    return (
                        <PaginationItem key={i}>
                        <PaginationEllipsis />
                        </PaginationItem>
                    )
                    }

                    return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={() => {
                          if (link.url) {
                          const url = new URL(link.url)
                          const page = url.searchParams.get('page')
                          handlePageChange(Number(page))
                          }
                        }}
                        isActive={link.active}
                        >
                        {link.label}
                      </PaginationLink>
                    </PaginationItem>
                    )
                })}

                {/* Add prev/next buttons */}
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={() => handlePageChange(products.meta.current_page - 1)}
                    isActive={products.meta.current_page > 1}
                    />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={() => handlePageChange(products.meta.current_page + 1)}
                    isActive={products.meta.current_page < products.meta.last_page}
                  />
                </PaginationItem>
                </PaginationContent>
            </Pagination>
        )}
    </>
  )
}