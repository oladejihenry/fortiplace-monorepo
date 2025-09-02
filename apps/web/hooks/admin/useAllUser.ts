import { useQuery } from "@tanstack/react-query"
import { fetchAllUsers } from "@/lib/admin/fetchAllUsers"

export const useAllUser = () => {
    return useQuery({
        queryKey: ['allUsers'],
        queryFn: fetchAllUsers,
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}