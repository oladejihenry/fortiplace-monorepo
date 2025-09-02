import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/lib/admin/fetchAllProducts"

export const useAllProducts = () => {
    return useQuery({
        queryKey: ['allProducts'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}