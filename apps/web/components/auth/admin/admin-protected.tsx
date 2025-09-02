"use client"

import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function AdminProtected({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      toast.error("You don't have permission to access this page")
      router.push("/dashboard")
    }
  }, [isLoading, user, isAdmin, router])

  // Show nothing while checking permissions
  if (isLoading || !user || !isAdmin) {
    return null
  }

  return <>{children}</>
}