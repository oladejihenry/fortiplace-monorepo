"use client"

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { registerFormSchema, RegisterFormSchema, registerUser } from "@/lib/auth/registerUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@workspace/ui/lib/utils";
import { useUser } from "@/hooks/useUser";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { useState } from "react";
import { EyeOff} from "lucide-react";
import { Eye } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
export default function RegisterForm() {

    const { setUser } = useUser()
    const [showPassword, setShowPassword] = useState(false)
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        setError 
    } = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: async() => {
            const user = await getCurrentUser()
            setUser(user)
            window.location.href = '/verify-email'
        },
        onError: (error) => {
            if (error instanceof AxiosError && error.response) {
                const { data } = error.response
                if (data.errors) {
                    //handle laravel validation errors
                    Object.keys(data.errors).forEach((key) => {
                        setError(key as keyof RegisterFormSchema, { message: data.errors[key][0] })
                    })
                } else if (data.message) {
                    toast.error('Registration failed', {
                        description: data.message || 'An unknown error occurred'
                    })
                } else {
                    toast.error('Registration failed', {
                        description: 'An unknown error occurred'
                    })
                }
            } else {
                toast.error("An error occurred")
            }
        }
    })

    const onSubmit = async(data: RegisterFormSchema) => {
        try {
          await mutation.mutateAsync(data)
        } catch (error) {
          toast.error('Registration failed', {
            description: `Error: ${error}`
          })
        }
    }

    const googleLoginUrl = process.env.NEXT_PUBLIC_API_URL + '/auth/google/url'
    const twitterLoginUrl = process.env.NEXT_PUBLIC_API_URL + '/auth/twitter/url'

  return (
    <>
      <div className="space-y-4">
        <Button asChild className="w-full" variant="outline">
          <Link href={googleLoginUrl}>
            <FcGoogle className="mr-2 h-5 w-5" />
            Register with Google
          </Link>
        </Button>
        <Button asChild className="w-full" variant="outline">
          <Link href={twitterLoginUrl}>
            <FaXTwitter className="mr-2 h-5 w-5" />
            Register with X (or Twitter)
          </Link>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
            </span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              className={cn(
                "w-full",
                errors.username && "border-red-500 focus-visible:ring-red-500"
              )}
              {...register('username')}
              disabled={isSubmitting}
            />
            {errors.username && (
                <p className="text-red-500 text-sm">
                    {errors.username.message}
                </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              className={cn(
                "w-full",
                errors.email && "border-red-500 focus-visible:ring-red-500"
              )}
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={cn(
                  "w-full",
                  errors.password && "border-red-500 focus-visible:ring-red-500"
                )}
                {...register('password')}
                disabled={isSubmitting}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <Button 
            className="w-full"
            disabled={isSubmitting || mutation.isPending}
            type="submit"
          >
            {isSubmitting || mutation.isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </>
  )
}