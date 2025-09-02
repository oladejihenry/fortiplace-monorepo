import { getCoupons } from '@/lib/coupons/coupons'
import { useQuery } from '@tanstack/react-query'

export const useCoupons = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => getCoupons(),
  })

  return {
    data: data?.coupons,
    isLoading,
    error,
  }
}
