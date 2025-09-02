import { getSession } from '../session'

export async function authFetch(endpoint: string, options: RequestInit = {}) {
  const session = await getSession()
  const cookieString = Object.entries(session)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')

  const headers = new Headers({
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cookie': cookieString,
    'Referer': process.env.NEXT_PUBLIC_URL || '',
    ...(options.headers || {})
  })

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers
  })
}