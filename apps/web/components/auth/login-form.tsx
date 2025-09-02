"use client"

import { FcGoogle } from "react-icons/fc";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/auth/loginUser";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { useUser } from "@/hooks/useUser";
import { getCurrentUser } from "@/lib/auth/currentUser";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
const loginFormSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password is required"}),
})

type LoginFormSchema = z.infer<typeof loginFormSchema>

export default function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { setUser } = useUser()
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

   const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async () => {
            const user = await getCurrentUser()
            setUser(user)
            toast.success("Logged in successfully")
            router.push(searchParams.get("from") || "/dashboard")
            
        },
        onError: (error) => {
            if(error instanceof AxiosError && error.response) {
                const {data} = error.response
                if(data.errors) {
                    Object.keys(data.errors).forEach((key) => {
                        setError(key as keyof LoginFormSchema, { 
                            message: data.errors[key][0] 
                        })
                    })
                } else if(data.message) {
                    toast.error('Login failed', {
                        description: data.message
                    })
                }else {
                    toast.error('Login failed')
                }
            }else {
                toast.error('Login failed')
            }
        },
    })

    const onSubmit = (data: LoginFormSchema) => {
        mutation.mutate(data)
    }

    const googleLoginUrl = process.env.NEXT_PUBLIC_API_URL + '/auth/google/url'
    const twitterLoginUrl = process.env.NEXT_PUBLIC_API_URL + '/auth/twitter/url'

    return (
        <>
            <div className="space-y-4">
                <Button asChild className="w-full" variant="outline">
                    <Link href={googleLoginUrl}>
                        <FcGoogle className="mr-2 h-5 w-5" />
                        Login with Google
                    </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                    <Link href={twitterLoginUrl}>
                        <FaXTwitter className="mr-2 h-5 w-5" />
                        Login with X (or Twitter)
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
                            type="email"
                            placeholder="Email"
                            className={cn(
                                "w-full",
                                errors.email && "border-red-500 focus-visible:ring-red-500"
                            )}
                            {...register("email")}
                            disabled={isSubmitting}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
                                {...register("password")}
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
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    
                    <Button 
                        className="w-full"
                        disabled={isSubmitting || mutation.isPending}
                    >
                        {isSubmitting || mutation.isPending ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </div>
        </>
    )
}