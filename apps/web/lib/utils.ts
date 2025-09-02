import { ProductType } from '@/types/product'
// import { clsx, type ClassValue } from "clsx"

import { format, startOfDay, addDays, endOfMonth, isFriday, subDays, addMonths } from 'date-fns'
import CryptoJS from 'crypto-js'
interface Price {
  currency: string
  price: number
  regularPrice: number | null
}

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

export function getPriceForCurrency(prices: Price[] | undefined, currency: string): number {
  if (!prices || !Array.isArray(prices)) return 0
  const priceObj = prices.find((p) => p.currency === currency)
  return priceObj?.price ?? 0
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export function formatProductType(type: string): string {
  switch (type) {
    case ProductType.COURSE:
      return 'Course'
    case ProductType.EBOOK:
      return 'E-book'
    case ProductType.DIGITAL:
      return 'Digital Product'
    default:
      return type
  }
}

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export const storage = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  },
  set: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  },
  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  },
}

export async function generateDownloadToken(orderId: string, email: string): Promise<string> {
  const tokenData = {
    orderId,
    email,
    expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  }

  const encryptionKey = process.env.NEXT_PUBLIC_APP_KEY
  console.log(encryptionKey)

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(tokenData), encryptionKey || '').toString()

  return encodeURIComponent(encrypted)
}

export function getNextPayoutDate(paymentSchedule: string | null | undefined): Date {
  if (!paymentSchedule) return new Date()

  const today = startOfDay(new Date())

  switch (paymentSchedule.toLowerCase()) {
    case 'daily':
      // If it's after cutoff time (e.g., 5 PM), pay next day
      const cutoffHour = 2 // 5 PM
      const now = new Date()
      return now.getHours() >= cutoffHour ? addDays(today, 1) : today

    case 'weekly':
      // Next Monday
      let nextMonday = today
      while (nextMonday.getDay() !== 1) {
        // 1 is Monday
        nextMonday = addDays(nextMonday, 1)
      }
      return nextMonday

    case 'monthly':
      // Find last Friday of current month
      let lastDayOfMonth = endOfMonth(today)
      let lastFriday = lastDayOfMonth

      // Go backwards until we find a Friday
      while (!isFriday(lastFriday)) {
        lastFriday = subDays(lastFriday, 1)
      }

      // If today is after the last Friday of this month,
      // get the last Friday of next month
      if (today > lastFriday) {
        const nextMonth = addMonths(today, 1)
        lastDayOfMonth = endOfMonth(nextMonth)
        lastFriday = lastDayOfMonth
        while (!isFriday(lastFriday)) {
          lastFriday = subDays(lastFriday, 1)
        }
      }

      return lastFriday

    default:
      return today
  }
}

export function formatPayoutDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function getUserInitials(username?: string) {
  if (!username) return ''

  const parts = username.trim().split(' ').filter(Boolean)

  if (parts.length === 0) return ''

  if (parts.length === 1) {
    const name = parts[0]!
    if (name.length < 2) return name.toUpperCase()
    const firstChar = name[0]
    const lastChar = name[name.length - 1]
    if (!firstChar || !lastChar) return ''
    return (firstChar + lastChar).toUpperCase()
  }

  const firstPart = parts[0]!
  const lastPart = parts[parts.length - 1]!

  const firstChar = firstPart[0]
  const lastChar = lastPart[0]

  if (!firstChar || !lastChar) return ''

  return (firstChar + lastChar).toUpperCase()
}

export async function getDeviceInfo() {
  const userAgent = navigator.userAgent
  const platform = navigator.platform
  const vendor = navigator.vendor
  const language = navigator.language
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const pixelRatio = window.devicePixelRatio
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent)
  const isDesktop = !isMobile && !isTablet

  return {
    userAgent,
    platform,
    vendor,
    language,
    screenWidth,
    screenHeight,
    pixelRatio,
    isMobile,
    isTablet,
    isDesktop,
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  }
}
