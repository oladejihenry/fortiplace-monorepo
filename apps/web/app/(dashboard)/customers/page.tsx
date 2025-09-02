import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "../loading"
import { CustomerHeader } from "@/components/customers/customer-header"
import { CustomersTable } from "@/components/customers/customers-table"

export const metadata: Metadata = {
  title: "Customers",
  description: "Customers",
}

interface Props {
  searchParams: Promise<{
    page: string
    search: string
  }>
}


export default async function CustomersPage({searchParams}: Props) {

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <CustomerHeader />
        <Suspense fallback={<Loading />}>
          <CustomersTable searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
