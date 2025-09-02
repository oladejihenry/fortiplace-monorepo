import Link from "next/link"
import Image from "next/image"
import { Toaster } from "sonner"

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col dark:bg-background">
      <Toaster />
      {/* Simple navbar */}
      <header className="border-b">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/fortiplace_transparent.png"
              alt="Fortiplace"
              width={400}
              height={400}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Home
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Contact
            </Link>
            <Link 
              href="/login" 
              className="text-sm font-medium bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition"
            >
              Sign In
            </Link>
          </nav>
          <div className="md:hidden">
            <Link 
              href="/login" 
              className="text-sm font-medium bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-md transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto max-w-7xl flex-grow px-4">
        {children}
      </main>

      {/* Simple footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Fortiplace. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link 
                href="/terms-of-service" 
                className="text-xs text-muted-foreground hover:text-foreground transition"
              >
                Terms of Service
              </Link>
              <Link 
                href="/privacy-policy" 
                className="text-xs text-muted-foreground hover:text-foreground transition"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/support" 
                className="text-xs text-muted-foreground hover:text-foreground transition"
              >
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}