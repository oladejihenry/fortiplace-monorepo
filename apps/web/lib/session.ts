import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = await cookies()
  
  return {
    'XSRF-TOKEN': cookieStore.get('XSRF-TOKEN')?.value,
    [process.env.NEXT_PUBLIC_COOKIE_NAME as string]: cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME as string)?.value
  }
}