import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "@/app/(dashboard)/loading"
import { ManageOrdersHeader } from "@/components/admin/orders/manage-orders-header"
import { ManageOrdersTable } from "@/components/admin/orders/manage-orders-table"


export const metadata: Metadata = {
  title: "Manage Orders",
  description: "Manage Orders",
}

export default function ManageOrdersPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <ManageOrdersHeader />
        <Suspense fallback={<Loading />}>
          <ManageOrdersTable />
        </Suspense>
      </div>
    </div>
  )
}