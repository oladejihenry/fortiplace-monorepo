import { Metadata } from "next"
import { VerifyEmail } from "@/components/auth/verify-email"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/currentUser"

export const metadata: Metadata = {
    title: 'Verify Email',
    description: 'Please verify your email address to continue',
}

export default async function VerifyEmailPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
        
            <VerifyEmail />
        </div>
    )
}