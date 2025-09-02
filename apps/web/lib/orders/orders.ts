import { AxiosError } from "axios"
import axios from "../axios"
import { toast } from "sonner"

export const getOrders = async () => {
    try {
        const response = await axios.get('/api/sales')
        return response.data.sales
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message)
            throw error.response?.data
        }
        throw error
    }
}