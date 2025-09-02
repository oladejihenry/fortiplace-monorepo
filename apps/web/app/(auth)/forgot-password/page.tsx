import { Suspense } from "react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/custom-ui/loader"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata = {
  title: "Forgot Password - FortiPlace",
  description: "Reset your password for your FortiPlace account",
}

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Forgot your password?</h1>
        <p className="text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <ForgotPasswordForm />
      </Suspense>

      <div className="text-center text-sm">
        <Link 
          href="/login" 
          className="text-muted-foreground hover:text-primary hover:underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}