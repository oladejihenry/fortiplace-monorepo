import { UsersTable } from "@/components/admin/users/users-table"
import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "@/app/(dashboard)/loading"
import { UsersHeader } from "@/components/admin/users/users-header"

export const metadata: Metadata = {
    title: 'Users',
    description: 'User Management',
}

export default async function UsersPage() {
    return (
        <div className="flex-1 space-y-6 p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <UsersHeader />
                <Suspense fallback={<Loading />}>
                    <UsersTable />
                </Suspense>
            </div>
        </div>
    )
}