import { DashboardUser } from "@/lib/auth/DashboardUser";
import { User } from "@/types/user";
import { useQuery, useQueryClient,  } from "@tanstack/react-query";

export function useUser() {
    const queryClient = useQueryClient()

    const {data: user, isLoading, error} = useQuery<User | null>({
        queryKey: ['user'],
        queryFn: DashboardUser,
        staleTime: 1000 * 60 * 5,
        retry: false,
    })

    const setUser = (userData: User | null) => {
        queryClient.setQueryData(['user'], userData)
    }

    const refetchUser = () => {
        return queryClient.invalidateQueries({ queryKey: ['user'] })
    }

    const userRole = user?.data?.role || ''
    
    return {
        user,
        isLoading,
        isAdmin: userRole.includes('admin'),
        isSeller: userRole.includes('creator'),
        isCustomer: userRole.includes('customer'),
        error,
        setUser,
        refetchUser,
        isAuthenticated: !!user,
        isEmailVerified: !!user?.data?.email_verified_at,
        isImpersonated: !!user?.data?.is_impersonated,
        role: userRole
    }
    
}
