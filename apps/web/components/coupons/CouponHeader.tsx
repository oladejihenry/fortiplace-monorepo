'use client'

import { parseAsString, useQueryState } from 'nuqs'
import { Input } from '@workspace/ui/components/input'
import { Plus } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { useRouter } from 'next/navigation'
import { useCoupons } from '@/hooks/useCoupons'

export function CouponHeader() {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))
  const router = useRouter()
  const { data: orders } = useCoupons()

  // Get total count from pagination metadata
  const totalCoupons = orders?.length || 0

  const handleNewCoupon = () => {
    router.push('/coupons/create')
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <span className="bg-muted relative box-border inline-flex h-8 items-center rounded-full px-2 text-sm font-medium">
            {totalCoupons}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Search coupons..."
            className="max-w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value || null)}
          />
          <Button className="text-nowrap" onClick={handleNewCoupon}>
            <Plus className="mr-2 h-4 w-4" />
            New Coupon
          </Button>
        </div>
      </div>
    </>
  )
}
