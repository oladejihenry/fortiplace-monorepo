'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { getAuthHeaders } from './cookies'
import { revalidatePath } from 'next/cache'

export const getCouponById = cache(async (couponId: string) => {
  try {
    const cookieStore = await cookies()
    const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value
    const laravelSession = cookieStore.get(
      process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session',
    )?.value

    const coupon = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${couponId}`, {
      headers: new Headers({
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
        Cookie: `XSRF-TOKEN=${xsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
      }),
      next: {
        revalidate: 60,
        tags: [`coupon-${couponId}`, 'coupons'],
      },
    })

    if (!coupon.ok) {
      return { status: coupon.status }
    }

    const data = await coupon.json()
    return data
  } catch (error) {
    //if product returns 401, redirect to login
    if (error instanceof Error && 'status' in error && error.status === 401) {
      redirect('/login')
    }
    throw error
  }
})

export const deleteCoupon = async (id: string) => {
  const headers = await getAuthHeaders()
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${id}`, {
    headers,
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    return {
      success: false,
      message: error.message || 'Failed to delete coupon',
    }
  }

  revalidatePath('/coupons')
  const data = await response.json()
  return data
}
