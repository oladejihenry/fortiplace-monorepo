import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "@/app/(dashboard)/loading"
import { ManageProductsHeader } from "@/components/admin/products/manage-products-header"
import { ManageProductsTable } from "@/components/admin/products/manage-products-table"
export const metadata: Metadata = {
    title: 'Manage Products',
    description: 'Manage Products',
}

export default function ManageProductsPage() {
    return (
        <div className="flex-1 space-y-6 p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <ManageProductsHeader />
                <Suspense fallback={<Loading />}>
                    <ManageProductsTable />
                </Suspense>
            </div>
        </div>
    )
}