import { cookies } from "next/headers"

export async function getAuthHeaders(extraHeaders: Record<string, string> = {}) {
    const cookieStore = await cookies()
    const bearerToken = cookieStore.get('token')?.value
    const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value
    const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value
    // console.log(bearerToken)

    if(bearerToken) {
        return {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: bearerToken ? `Bearer ${bearerToken}` : '',
            Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
            ...extraHeaders,
        }
    }

    if (laravelSession && xsrfToken) {
        return {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
            Cookie: `XSRF-TOKEN=${xsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
            ...extraHeaders,
        }
    }

    return {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
        ...extraHeaders,
    }
    
    
}