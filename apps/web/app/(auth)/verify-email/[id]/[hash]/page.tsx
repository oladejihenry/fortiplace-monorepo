import { Metadata } from "next"
import { ActualVerify } from "@/components/auth/actual-verify"
export const metadata: Metadata = {
    title: 'Verifying Email',
    description: 'Verifying your email address to continue',
}

type Props = {  
    params: Promise<{
        id: string
        hash: string
    }>
}

export default async function ActualVerifyEmailPage({ params }: Props) {
    const { id, hash } = await params
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        
            <ActualVerify id={id} hash={hash} />
        </div>
    )
}