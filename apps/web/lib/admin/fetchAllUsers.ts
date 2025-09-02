import axios from "../axios"
import { AxiosError } from "axios"
import { toast } from "sonner"

export async function fetchAllUsers() {
    try {
        const {data} = await axios.get('/api/admin/users')
        return data
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message)
            throw error.response?.data
        }
        throw error
    }
}