import { fetchAllUsers } from "@/lib/admin/fetchAllUsers";
import { User } from "@/types/user";
import { useQuery, useQueryClient,  } from "@tanstack/react-query";

export function useAdminUser() {
    const queryClient = useQueryClient()

    const {data: user, isLoading, error} = useQuery<User | null>({
        queryKey: ['admin-users'],
        queryFn: fetchAllUsers,
        staleTime: 1000 * 60 * 5,
        retry: false,
    })

    const setUser = (userData: User | null) => {
        queryClient.setQueryData(['admin-users'], userData)
    }

    const refetchUser = () => {
        return queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    }

    
    return {
        user,
        isLoading,
        error,
        setUser,
        refetchUser,
        isAuthenticated: !!user,
        isEmailVerified: !!user?.data?.email_verified_at,
    }
    
}
