import { ManagePaymentsHeader } from "@/components/admin/payments/manage-payments-header"
import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "../../loading"
import { ManagePaymentsTable } from "@/components/admin/payments/manage-payments-table"

export const metadata: Metadata = {
    title: "Manage Payments",
    description: "Manage Payments",
}

export default function ManagePaymentsPage() {
    return (
        <div className="flex-1 space-y-6 p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <ManagePaymentsHeader />
                <Suspense fallback={<Loading />}>
                    <ManagePaymentsTable />
                </Suspense>
            </div>
        </div>
    )
}