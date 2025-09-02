import { CouponHeader } from '@/components/coupons/CouponHeader'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from '../loading'
import { CouponTable } from '@/components/coupons/CouponTable'

export const metadata: Metadata = {
  title: 'Coupons',
  description: 'Coupons',
}

export default function CouponsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <CouponHeader />
        <Suspense fallback={<Loading />}>
          <CouponTable />
        </Suspense>
      </div>
    </div>
  )
}
