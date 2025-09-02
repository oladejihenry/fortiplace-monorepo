"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import { Loader2 } from "lucide-react"

interface AuthWrapperProps {
    children: React.ReactNode
}

const publicPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/callback',
    '/google/callback',
    '/password-reset',
]

const mainPaths = [
    '/',
    '/about',
    '/contact',
    '/terms-of-service',
    '/privacy-policy',
    '/guides',
    '/help',
    '/support',
    '/contact',
]

export function AuthWrapper({ children }: AuthWrapperProps) {
    const { isLoading, isAuthenticated, isEmailVerified } = useUser()
    const router = useRouter()
    const pathname = usePathname()


    useEffect(() => {
        if (isLoading) return

        // Check if we're on a subdomain
        const isSubdomain = window.location.hostname.split('.').length > (process.env.NODE_ENV === 'production' ? 2 : 1)
        
        // If we're on a subdomain, allow access without authentication
        if (isSubdomain) return

        const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
        const isMainPath = mainPaths.some(path => pathname === path)
        const isApiPath = pathname.startsWith('/api/')

        if (isMainPath || isApiPath) return

        if (isPublicPath) {
            if (isAuthenticated) {
                router.push('/dashboard')
                return
            }
            return
        }

        if (!isAuthenticated) {
            router.push(`/login?from=${pathname}`)
            return
        }

        if (!isEmailVerified && !pathname.startsWith('/verify-email')) {
            router.push('/verify-email')
            return
        }

        if (isEmailVerified && pathname.startsWith('/verify-email')) {
            router.push('/dashboard')
            return
        }
    }, [isLoading, isAuthenticated, isEmailVerified, pathname, router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-2">Loading...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}