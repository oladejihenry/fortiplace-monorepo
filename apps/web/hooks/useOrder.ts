import { getOrders } from "@/lib/orders/orders"
import { useQuery } from "@tanstack/react-query"

export const useOrders = () => {
    const {data, isLoading, error} = useQuery({
        queryKey: ['orders'],
        queryFn: () => getOrders()
    })

    return {
        data,
        isLoading,
        error
    }
}