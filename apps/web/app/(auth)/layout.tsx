import Image from "next/image"
import { Toaster } from "sonner"
import { UserProvider } from "@/lib/providers/user-provider"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
        <Toaster />
        <div className="grid lg:grid-cols-2 h-screen">
            
            {/* Left side - Image */}
            <div className="hidden lg:block relative">
                <Image
                    src="https://creating.lon1.cdn.digitaloceanspaces.com/logo/fortiplace-login.png" // You'll need to add this image to your public folder
                    alt="Authentication background"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
                <div className="absolute inset-0" />
                <div className="absolute inset-0 bg-black/55" />
            </div>
      
            {/* Right side - Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                <div className="flex justify-center lg:hidden">
                  <h1 className="text-3xl font-bold text-primary">FortiPlace</h1>
                </div>
                {children}
                </div>
            </div>
        </div>
    </UserProvider>
  )
}