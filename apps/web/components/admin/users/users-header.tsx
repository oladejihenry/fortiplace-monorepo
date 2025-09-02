'use client'
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";
import { useAllUser } from "@/hooks/admin/useAllUser";

export function UsersHeader() {
    const [search, setSearch] = useQueryState(
        'search',
        parseAsString.withDefault('')
    )
    const {data: users} = useAllUser()

    //users count
    const usersCount = users?.meta.total
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                <span className="relative inline-flex h-8 items-center rounded-full bg-muted box-border px-2 text-sm font-medium">
                    {usersCount}
                </span>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Input 
                    placeholder="Search users..."
                    className="max-w-[300px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    )
}