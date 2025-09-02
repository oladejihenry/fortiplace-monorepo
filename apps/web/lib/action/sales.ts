"use server"

import { cookies } from "next/headers"

export async function getSales() {
    try {
        const cookieStore = await cookies()
        const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value
        const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value
        const token = cookieStore.get('token')?.value
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales`, {
            headers: new Headers({
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
                Cookie: `XSRF-TOKEN=${xsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
                Authorization: `Bearer ${token}`,
            })
        })
    if(!response.ok) {
        return { status: response.status }
    }
    const data = await response.json()
    return data
    } catch (error) {
        console.error(error)
        throw error
    }
}