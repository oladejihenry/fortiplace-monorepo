import { z } from "zod"
import axios from "../axios"
import { getCsrfToken } from "../csrfToken"
import { AxiosError } from "axios"
export const registerFormSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

export type RegisterFormSchema = z.infer<typeof registerFormSchema>

export const registerUser = async (formData: RegisterFormSchema) => {
    try {
        await getCsrfToken()
        const response = await axios.post("/register", formData)
        return response.data.user
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 409) {
            throw error.response?.data
        }
        throw error
    }
}
