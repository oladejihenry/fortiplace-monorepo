import axios from "../axios"
import { getCsrfToken } from "../csrfToken"
interface GetProductsParams {
    page?: number
    per_page?: number
    search?: string
}

export const getProducts = async (params: GetProductsParams) => {
    try {
        await getCsrfToken()
        const searchParams = new URLSearchParams({
            page: String(params?.page || 1),
            per_page: String(params?.per_page || 15),
            ...(params?.search && { search: params.search }),
        })

        const response = await axios.get('/api/products', {
            params: searchParams
        })
        return response.data
    } catch (error) {
        console.error("Error fetching products:", error)
        throw error
    }
}