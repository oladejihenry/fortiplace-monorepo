import { Inter } from "next/font/google"
import "@workspace/ui/globals.css"
import type React from "react"
import { Analytics } from '@vercel/analytics/next';
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Analytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

