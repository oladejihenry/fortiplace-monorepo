
import Link from "next/link"

import LoginForm from "@/components/auth/login-form"
import { Metadata } from "next"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/custom-ui/loader"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage() {
   
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Hello again! Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to continue</p>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <LoginForm />
      </Suspense>


      <div className="flex flex-col space-y-4 text-center text-sm">
        <Link 
          href="/forgot-password" 
          className="text-muted-foreground hover:text-primary hover:underline"
        >
          Forgot your password?
        </Link>
        
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}