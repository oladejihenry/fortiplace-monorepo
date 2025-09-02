import { Suspense } from "react"
import { LoadingSpinner } from "@/components/custom-ui/loader"
import { PasswordResetForm } from "@/components/auth/password-reset-form"


export const metadata = {
  title: "Reset Password - FortiPlace",
  description: "Create a new password for your FortiPlace account",
}

export default async function PasswordResetPage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { token } = await params
  const {email = ""} = await searchParams

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground">
          Create a new password for your account
        </p>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <PasswordResetForm token={token} defaultEmail={email} />
      </Suspense>
    </div>
  )
}