'use server'

import { cookies } from 'next/headers' 

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME as string)
    if (!token) {
        return null
    }

    try {
        const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value
        const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value
        const tokenImpersonated = cookieStore.get('token')?.value
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
            method: 'GET',
            headers: new Headers({
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
                Cookie: `XSRF-TOKEN=${xsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
                Authorization: `Bearer ${tokenImpersonated}`,
            }),
        })
        if (!response.ok) {
            return null
        }
        const data = await response.json()
        return data
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return null
        }
        throw error
    }
}