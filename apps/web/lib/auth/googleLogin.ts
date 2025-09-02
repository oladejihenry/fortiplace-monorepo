import axios from "../axios"
import { AxiosError } from "axios"
import { toast } from "sonner"
export async function initiateGoogleLogin() {
    try {
        const response = await axios.get("/api/auth/google/url")

        // redirect to the url
        window.location.href = response.data.url
    } catch (error) {
        if(error instanceof AxiosError) {
            toast.error(error.response?.data.message || "Error initiating Google login")
        } else {
            toast.error("Error initiating Google login")
        }
        throw error
    }
}
