import { Metadata } from "next"
import { PayoutDetails } from "@/components/payouts/payout-details"
import { PayoutAccountPlaceholder } from "@/components/payouts/payout-account-placeholder"
import { getCurrentUser } from "@/lib/auth/currentUser"
import { Suspense } from "react"
import Loading from "../loading"

export const metadata: Metadata = {
    title: "Payouts",
    description: "Payouts Page",
}

export default async function PayoutsPage() {
    const user = await getCurrentUser()

    const hasBankDetails = !!(user?.data?.bank_code && user.data?.bank_account_number);

    return (
        <div className="flex-1 space-y-6 p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">Payouts</h2>
                    </div>
                </div>
                
                <div className="mt-8">
                    {!hasBankDetails ? (
                        <Suspense fallback={<Loading />}>
                            <PayoutAccountPlaceholder />
                        </Suspense>
                    ) : (
                        <Suspense fallback={<Loading />}>
                            <PayoutDetails user={user} />
                        </Suspense>
                    )}
                </div>
            </div>
        </div>
    )
}