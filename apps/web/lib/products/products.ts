import { toast } from "sonner"
import axios from "../axios"
import { AxiosError } from "axios"
interface GetProductsParams {
  page?: number
  per_page?: number
  search?: string
}
export const getProducts = async (params?: GetProductsParams) => {
    try {
        const response = await axios.get('/api/products', {
            params: params
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