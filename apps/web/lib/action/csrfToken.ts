"use server"
import { cookies } from "next/headers"

export async function getCsrfToken() {
    const cookieStore = await cookies()
    const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: new Headers({
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
            Cookie: `${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
        }),
    });
}