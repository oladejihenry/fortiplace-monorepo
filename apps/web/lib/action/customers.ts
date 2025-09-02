"use server"

import { cookies } from "next/headers"
import { PaginatedResponse, Customer } from "@/types/customers"
interface GetCustomersParams {
  page?: number
  per_page?: number
  search?: string
}

export async function getCustomers(params?: GetCustomersParams) {
    try {
        const searchParams = new URLSearchParams({
            page: String(params?.page || 1),
            per_page: String(params?.per_page || 15),
            ...(params?.search && { search: params.search }),
        })

        const cookieStore = await cookies()
        const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value
        const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value
        const token = cookieStore.get('token')?.value
        const customers = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/customers?${searchParams}`,
            {
                headers: new Headers({
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
                    Cookie: `XSRF-TOKEN=${xsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
                    Authorization: `Bearer ${token}`,
                })
            }
        )
        
        const data: PaginatedResponse<Customer> = await customers.json()
        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}