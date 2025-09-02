'use client'

import { parseAsString, useQueryState } from "nuqs";
import { Input } from "@workspace/ui/components/input";
import { useOrders } from "@/hooks/useOrder";

export function CustomerHeader() {
    const [search, setSearch] = useQueryState(
        'search',
        parseAsString.withDefault('')
    )

    const {data: orders} = useOrders()

    //orders count
    const ordersCount = orders?.length
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Customer Orders</h2>
            <span className="relative inline-flex h-8 items-center rounded-full bg-muted box-border px-2 text-sm font-medium">
                {ordersCount}
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