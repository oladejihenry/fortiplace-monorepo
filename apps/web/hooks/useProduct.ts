import { useQuery } from "@tanstack/react-query"
import { getProducts } from "@/lib/products/products"
import { PaginatedResponse, Product } from "@/types/product"
import { useSearchParams } from "next/navigation"

export const useProducts = () => {
    const params = useSearchParams()
    const page = params.get('page') || 1
    const per_page = params.get('per_page') || 15
    const search = params.get('search') || ''
    
    return useQuery<PaginatedResponse<Product>>({
        queryKey: ['products', page, per_page, search],
        queryFn: () => getProducts({ page: Number(page), per_page: Number(per_page), search }),
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}