import { toast } from "sonner"
import axios from "../axios"
import { AxiosError } from "axios"

interface GetCustomerOrdersParams {
    page?: number
    per_page?: number
    search?: string
}

export const getCustomerOrders = async (params?: GetCustomerOrdersParams) => {
    try {
        const response = await axios.get('/api/customer-orders', {
            params: {
                page: params?.page || 1,
                per_page: params?.per_page || 10,
                ...(params?.search && { search: params.search })
            }
        })
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message)
            throw error.response?.data
        }
        throw error
    }
}