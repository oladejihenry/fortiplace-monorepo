import RegisterForm from "@/components/auth/register-form"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register",
  description: "Register to get started",
}

export default async function RegisterPage() {
    return (
    <div
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Create your FortiPlace account</h2>
        <p className="text-muted-foreground">Enter your details to get started and start selling your products</p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        By registering you agree to our <Link href="/terms-of-service" className="font-medium text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="font-medium text-primary hover:underline">Privacy Policy</Link>
      </p>

      <hr className="border-border" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}