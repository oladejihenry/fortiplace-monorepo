import { AxiosError } from "axios"
import axios from "../axios"

export async function getIntegrations() {
    try {
        const response = await axios.get("/api/integrations")
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(error.response?.data)
        }
        return null
    }
}