'use client'

import { useUser } from "@/hooks/useUser"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import axios from "@/lib/axios"
export default function GoogleCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const {setUser} = useUser()

    useEffect(() => {
        axios.get('/api/user').then((res) => {
            console.log(res.data)
            setUser(res.data)
            // router.push('/dashboard')
        }).catch((err) => {
            if(err.response.status === 401) {
                toast.error('Failed to get user')
                router.push('/login')
            }
        })

    }, [router, searchParams, setUser])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <p className="mt-2">Signing you in with Google...</p>
            </div>
        </div>
    )
}