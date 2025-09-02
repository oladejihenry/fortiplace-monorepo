import { AxiosError } from "axios"
import axios from "../axios"
import { getCsrfToken } from "../csrfToken"

export const verifyEmail = async () => {
    try {
        await getCsrfToken()
        const response = await axios.post('/email/verification-notification')
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 400) {
            throw error.response?.data
        }
        throw error
    }
}