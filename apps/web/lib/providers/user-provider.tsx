'use client'

import { useUser } from "@/hooks/useUser"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
export function UserProvider({ children }: { children: React.ReactNode }) {
  // Pre-fetch user data on mount
  useUser()

  return (
    <AuthWrapper>
      {children}
    </AuthWrapper>
  )
}