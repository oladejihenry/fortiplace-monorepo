import { getCustomerOrders } from "@/lib/customer-orders/customer-orders"
import { useQuery } from "@tanstack/react-query"
import { useQueryState } from "nuqs"
import { parseAsString } from "nuqs"

export const useCustomerOrder = () => {
    const [page] = useQueryState('page', parseAsString.withDefault('1'))
    const [search] = useQueryState('search', parseAsString.withDefault(''))

    const {data, isLoading, error} = useQuery({
        queryKey: ['customer-orders', page, search],
        queryFn: () => getCustomerOrders({ page: Number(page), search })
    })

    return {
        data,
        isLoading,
        error
    }
}
