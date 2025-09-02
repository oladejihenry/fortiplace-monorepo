import { AdminEmailCampaignForm } from "@/components/admin/email/admin-email-campaign-form"
import { LoadingSpinner } from "@/components/custom-ui/loader"
import { Suspense } from "react"
import { Metadata } from "next"
type Props = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Send Email',
  description: 'Send Email',
}

export default async function SendEmailPage({params}: Props) {
    const {id} = await params
    return (
        <div className="flex-1 space-y-6 p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminEmailCampaignForm id={id} />
                </Suspense>
            </div>
        </div>
    )
}