import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "../../loading"
import { EmailCampaignsManager } from "@/components/admin/email/email-campaign-manager"

export const metadata: Metadata = {
    title: 'Email Campaigns',
    description: 'Email Campaigns',
}

export default function SendEmailPage() {
    

    return (
        <div className="flex-1 space-y-6 p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <Suspense fallback={<Loading />}>
                    <EmailCampaignsManager />
                </Suspense>
            </div>
        </div>
    )
}