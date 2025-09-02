import { z } from "zod"
import axios from "../axios"
import { getCsrfToken } from "../csrfToken"
import { AxiosError } from "axios"

export const loginFormSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>

export const loginUser = async (formData: LoginFormSchema) => {
    try {
        await getCsrfToken()
        const response = await axios.post("/login", formData)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 422) {
            throw error.response?.data
        } else if (error instanceof AxiosError && error.response?.status === 401) {
            throw error.response?.data
        } else if (error instanceof AxiosError && error.response?.status === 403) {
            throw error.response?.data
        } else {
            throw error
        }
    }
}