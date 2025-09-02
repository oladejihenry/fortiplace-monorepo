'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import axios from "@/lib/axios"
import { AxiosError } from "axios"

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Initialize form
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Form submission handler
  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsSubmitting(true)

    try {
      // Send password reset request to backend
      await axios.post('/forgot-password', values)
      
      // Update UI to show success message
      setEmailSent(true)
      toast.success("Password reset link sent to your email")
    } catch (error) {
      if (error instanceof AxiosError) {

        toast.error(error.response?.data?.message || "Failed to send password reset link. Please try again.")
      } else {

        toast.error("Failed to send password reset link. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success message if email was sent
  if (emailSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-lg border border-green-100 bg-green-50 p-6 dark:border-green-900/30 dark:bg-green-900/20">
          <h3 className="mb-2 font-medium text-green-800 dark:text-green-300">
            Check your email
          </h3>
          <p className="text-sm text-green-700 dark:text-green-400">
            We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive an email? Check your spam folder or 
          <button 
            type="button"
            onClick={() => setEmailSent(false)}
            className="ml-1 font-medium text-primary hover:underline"
          >
            try again
          </button>
        </p>
      </div>
    )
  }

  // Show the form if email hasn't been sent
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  )
}