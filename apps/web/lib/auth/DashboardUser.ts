import { AxiosError } from "axios"
import { axios } from "../axios"
export async function DashboardUser() {
    try {
        const {data} = await axios.get('/api/user')
        return data
    } catch (error) {
        if(error instanceof AxiosError && error.response?.status === 401) {
            return null
        }
        return null
    }
}