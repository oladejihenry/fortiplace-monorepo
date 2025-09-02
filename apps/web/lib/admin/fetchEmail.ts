import axios from "../axios"
import { AxiosError } from "axios"

export async function getEmailCampaignById(id: string) {
    try {
        const response = await axios.get(`/api/admin/promotions/${id}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data
        }else{
            return null
        }
    }
}