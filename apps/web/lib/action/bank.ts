"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import { getCurrentUser } from "../auth/currentUser"
import { getCsrfToken } from "./csrfToken"
import { revalidatePath } from "next/cache"

interface FormState{
    message?: string
    errors?: {
        bank_code?: string[]
        bank_account_number?: string[]
        payment_schedule?: string[]
    }
}

const formSchema = z.object({
  bank_code: z.string().min(1, "Bank name is required"),
  bank_id: z.string().min(1, "Bank id is required"),
  bank_name: z.string().min(1, "Bank name is required"),
  bank_account_number: z.string().min(1, "Account number is required")
    .length(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain only numbers"),
  payment_schedule: z.string().min(1, "Payment schedule is required"),
});


export async function createBankAccount(prevState: FormState, formData: FormData){
    const cookieStore = await cookies()
    const rawFormData = {
        bank_code: formData.get("bank_code"),
        bank_account_number: formData.get("bank_account_number"),
        bank_id: formData.get("bank_id"),
        bank_name: formData.get("bank_name"),
        payment_schedule: formData.get("payment_schedule"),
    }

    const user = await getCurrentUser()

    const validatedFields = formSchema.safeParse(rawFormData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please check the form for errors.",
        }
    }

    try {
        await getCsrfToken()
        
        const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value
        
        const updatedXsrfToken = cookieStore.get('XSRF-TOKEN')?.value
        const token = cookieStore.get('token')?.value
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bank/bank-details`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': updatedXsrfToken || '',
                'X-Requested-With': 'XMLHttpRequest',
                Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
                Cookie: `XSRF-TOKEN=${updatedXsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                bank_code: rawFormData.bank_code,
                bank_account_number: rawFormData.bank_account_number,
                bank_id: rawFormData.bank_id,
                bank_name: rawFormData.bank_name,
                payment_schedule: rawFormData.payment_schedule,
            }),
        })

        if(!response.ok) {
            const errorData = await response.json().catch(() => null);
            return {
                errors: errorData?.errors || {},
                message: errorData?.message || "Failed to update bank account. Please try again.",
            }
        }

        revalidatePath('/settings')
        
        return {
            message: "Bank account updated successfully",
            data: user,
        }
        
    }catch(error){
        console.error(error)
        return {
            message: "Something went wrong",
        }
    }
}

