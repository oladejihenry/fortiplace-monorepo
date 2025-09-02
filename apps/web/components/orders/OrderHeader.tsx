'use client'

import { parseAsString, useQueryState } from "nuqs";
import { Input } from "@workspace/ui/components/input";
import { useCustomerOrder } from "@/hooks/useCustomerOrder";

export function OrderHeader() {
    const [search, setSearch] = useQueryState(
        'search',
        parseAsString.withDefault('')
    )

    const {data: orders} = useCustomerOrder()
    // Get total count from pagination metadata
    const totalOrders = orders?.meta?.total || 0

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">
                    Orders
                </h2>
                <span className="relative inline-flex h-8 items-center rounded-full bg-muted box-border px-2 text-sm font-medium">
                    {totalOrders}
                </span>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Input 
                    placeholder="Search orders..."
                    className="max-w-[300px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    )
}