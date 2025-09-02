import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "../loading"
import { OrderHeader } from "@/components/orders/OrderHeader"
import { OrdersTable } from "@/components/orders/OrdersTable"

export const metadata: Metadata = {
  title: "Orders",
  description: "Orders",
}

export default function OrderPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <OrderHeader />
        <Suspense fallback={<Loading />}>
          <OrdersTable />
        </Suspense>
      </div>
    </div>
  )
}