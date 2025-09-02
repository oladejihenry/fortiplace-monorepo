import { CouponForm } from '@/components/coupons/CouponForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Coupon',
  description: 'Create Coupon',
}

export default function CreateCouponPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Create Coupon</h1>
          </div>
        </div>
        <CouponForm />
      </div>
    </div>
  )
}
