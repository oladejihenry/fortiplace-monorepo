import { EditCouponForm } from '@/components/coupons/EditCouponForm'
import { Metadata } from 'next'
import { getCouponById } from '@/lib/action/coupons'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/custom-ui/loader'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Edit Coupon',
  description: 'Edit Coupon',
}

export default async function EditCouponPage({ params }: Props) {
  const { id } = await params

  const initialData = await getCouponById(id)

  if (!initialData) {
    return notFound()
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Edit Coupon</h1>
          </div>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <EditCouponForm initialData={initialData.coupon} />
        </Suspense>
      </div>
    </div>
  )
}
