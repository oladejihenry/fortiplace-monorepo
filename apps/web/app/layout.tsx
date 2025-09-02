import { Geist, Geist_Mono } from 'next/font/google'
import '@workspace/ui/globals.css'
import type React from 'react'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontSans.className}>
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
