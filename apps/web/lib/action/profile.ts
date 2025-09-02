'use server'

import { z } from "zod"
import { getCurrentUser } from "../auth/currentUser"
import { cookies } from "next/headers"
import { getCsrfToken } from "./csrfToken"
import { revalidatePath } from "next/cache"

interface FormState{
    message?: string
    errors?: {
        username?: string[]
        email?: string[]
        phone_number?: string[]
        description?: string[]
        // logo?: string[]
    }
}

const ProfileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone_number: z.string().optional(),
  description: z.string().optional(),
  store_name: z.string().optional(),
//   logo: z.string().url().optional(),
})


export async function updateProfile(prevState: FormState, formData: FormData) {
    const cookieStore = await cookies()
    const rawFormData = {
        username: formData.get("username"),
        email: formData.get("email"),
        phone_number: formData.get("phone_number"),
        description: formData.get("description"),
        store_name: formData.get("store_name"),
    }

    const user = await getCurrentUser()

    const validatedFields = ProfileSchema.safeParse(rawFormData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please check the form for errors.",
        }
    }
    

    try {
        // Get CSRF token and session cookie
        const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value
        
        // First, get a fresh CSRF token
        await getCsrfToken()
        
        // Get the updated CSRF token
        const updatedXsrfToken = cookieStore.get('XSRF-TOKEN')?.value
        const token = cookieStore.get('token')?.value
        // Now make the actual request with the fresh token
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user?.data?.id}`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(validatedFields.data),
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': updatedXsrfToken || '',
                'X-Requested-With': 'XMLHttpRequest',
                Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
                Cookie: `XSRF-TOKEN=${updatedXsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
                Authorization: `Bearer ${token}`,
            }),
        })

        const updatedUser = await response.json()
        
        if(!response.ok) {
            const errorData = await response.json().catch(() => null);
            return {
                message: errorData?.message || "Failed to update profile. Please try again.",
                toast: false
            }
        }

        revalidatePath('/settings')
        
        return {
            message: "Profile updated successfully",
            data: updatedUser,
            toast: true
        }

    } catch(error) {
        console.error(error)
        return {
            message: "Failed to update profile. Please try again.",
        }
    }
}