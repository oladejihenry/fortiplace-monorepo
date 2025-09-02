"use client"

import { Button } from "@workspace/ui/components/button"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { Mail } from "lucide-react"
import { verifyEmail } from "@/lib/auth/verifyEmail"

export function VerifyEmail() {
  const [countdown, setCountdown] = useState(0)

  const resendMutation = useMutation({
    mutationFn: async () => {
      await verifyEmail()
    },
    onSuccess: () => {
      toast.success('Verification email sent!')
      // Start countdown for resend button
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((current) => {
          if (current <= 1) {
            clearInterval(timer)
            return 0
          }
          return current - 1
        })
      }, 1000)
    },
    onError: () => {
      toast.error('Failed to send verification email')
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-primary/10 p-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground">
            We sent you a verification link. Please check your email and click the link to verify your account.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => resendMutation.mutate()}
          disabled={countdown > 0 || resendMutation.isPending}
        >
          {countdown > 0
            ? `Resend email in ${countdown}s`
            : resendMutation.isPending
            ? "Sending..."
            : "Resend verification email"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive an email? Check your spam folder or try another email address.
        </p>
      </div>
    </div>
  )
}