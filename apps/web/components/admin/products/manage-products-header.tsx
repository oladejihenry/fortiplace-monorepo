'use client'
import { Input } from "@/components/ui/input";
import { useAllProducts } from "@/hooks/admin/useAllProducts";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";

export function ManageProductsHeader() {
    const [search, setSearch] = useQueryState(
        'search',
        parseAsString.withDefault('')
    )
    const {data: products} = useAllProducts()
    //products count
    const productsCount = products?.meta.total
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
                <span className="relative inline-flex h-8 items-center rounded-full bg-muted box-border px-2 text-sm font-medium">
                    {productsCount}
                </span>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Input 
                    placeholder="Search products..."
                    className="max-w-[300px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    )
}