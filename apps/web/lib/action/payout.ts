"use server"

import { cookies } from "next/headers";
import { PayoutsResponse } from "@/types/payout";

export async function getPayouts(): Promise<PayoutsResponse | null> {
  try {
    const cookieStore = await cookies();
    const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value;
    const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payouts`, {
      headers: new Headers({
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
        Cookie: `XSRF-TOKEN=${xsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
      }),
      next: {
        revalidate: 60,
        tags: ['payouts'],
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch payouts:', response.status);
      return null;
    }

    const data: PayoutsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return null;
  }
}

export async function getPayoutDetails(reference: string) {
  try {
    const cookieStore = await cookies();
    const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value;
    const laravelSession = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'laravel_session')?.value;
    const token = cookieStore.get('token')?.value
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payouts/${reference}`, {
      headers: new Headers({
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
        Cookie: `XSRF-TOKEN=${xsrfToken};${process.env.NEXT_PUBLIC_COOKIE_NAME}=${laravelSession}`,
        Authorization: `Bearer ${token}`,
      }),
      next: {
        revalidate: 60,
        tags: ['payouts'],
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching payout details:', error);
    return null;
  }
}