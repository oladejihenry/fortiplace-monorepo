import { useQuery } from "@tanstack/react-query"
import { parseAsInteger, parseAsString } from "nuqs"
import { useQueryState } from "nuqs"
import axios from "@/lib/axios"

interface Payment {
  id: string
  order_id: string
  amount: number
  currency: string
  payment_status: string
  payment_reference: string
  customer_email: string
  payment_gateway: string
  provider_reference: string
  commission_amount: number
  seller_amount: number
  amount_ngn: number
  created_at: string
  updated_at: string
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export function usePayments() {
    const [search] = useQueryState('search', parseAsString.withDefault(''))
    const [paymentReference] = useQueryState('payment_reference', parseAsString.withDefault(''))
    const [paymentStatus] = useQueryState('payment_status', parseAsString.withDefault(''))
    const [paymentGateway] = useQueryState('payment_gateway', parseAsString.withDefault(''))
    const [startDate] = useQueryState('start_date', parseAsString.withDefault(''))
    const [endDate] = useQueryState('end_date', parseAsString.withDefault(''))
    const [sortBy] = useQueryState('sort_by', parseAsString.withDefault('created_at'))
    const [sortDirection] = useQueryState('sort_direction', parseAsString.withDefault('desc'))
    const [page] = useQueryState('page', parseAsInteger.withDefault(1))
    const [perPage] = useQueryState('per_page', parseAsInteger.withDefault(15))

    return useQuery<PaginatedResponse<Payment>>({
        queryKey: ['payments', search, paymentReference, paymentStatus, paymentGateway, startDate, endDate, sortBy, sortDirection, page, perPage],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (search) params.append('search', search)
            if (paymentReference) params.append('payment_reference', paymentReference)
            if (paymentStatus && paymentStatus !== 'all') params.append('payment_status', paymentStatus)
            if (paymentGateway && paymentGateway !== 'all') params.append('payment_gateway', paymentGateway)
            if (startDate) params.append('start_date', startDate)
            if (endDate) params.append('end_date', endDate)
            if (sortBy) params.append('sort_by', sortBy)
            if (sortDirection) params.append('sort_direction', sortDirection)
            params.append('page', page.toString())
            params.append('per_page', perPage.toString())

            const response = await axios.get(`/api/admin/payments/list?${params.toString()}`)
            return response.data
        }
    })
}